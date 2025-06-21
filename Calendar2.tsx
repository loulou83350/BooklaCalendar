
import * as React from "react"

// === CONFIGURATION BOOKLA ===
const ORGANIZATION_ID = "18566a74-b1ab-4345-948a-517f2ca10f09"
const API_KEY = "teVkXn9d17cKZknCZopXDsEPz8SHs2Mf3E7r"
const BASE_URL = "https://us.bookla.com"
const RESOURCE_ID = "8f653843-ae64-4d1a-9701-3a1ab12d133c"

// Services et tarifs
const SERVICES = [
    {
        id: "e7c09d8e-e012-4b82-8b31-d584fa4be8ae",
        name: "Service Journée",
        basePrice: 300,
        apaPrice: 100,
    },
    {
        id: "1b994905-1980-4c7d-813a-66fcb8d88f92",
        name: "Service Sunset",
        basePrice: 200,
        apaPrice: 50,
    },
    {
        id: "7c3ca43d-37b4-483e-b3f6-39e8aed4afe9",
        name: "Service Mix",
        basePrice: 350,
        apaPrice: 120,
    },
]
const MONTHS = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
]
const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

function formatDateString(date: Date): string {
    return date.toISOString().split("T")[0]
}

export default function Calendar() {
    const today = new Date()
    const [year, setYear] = React.useState(today.getFullYear())
    const [month, setMonth] = React.useState(today.getMonth())
    const [service, setService] = React.useState(SERVICES[0].id)
    const [dates, setDates] = React.useState<string[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    // Réservation
    const [dateSelected, setDateSelected] = React.useState<string | null>(null)
    const [showForm, setShowForm] = React.useState(false)
    const [customer, setCustomer] = React.useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        terms: false,
    })

    // Récupérer disponibilités
    React.useEffect(() => {
        async function loadSlots() {
            setLoading(true)
            setError(null)
            try {
                const from = new Date(year, month, 1).toISOString()
                const to = new Date(
                    year,
                    month + 1,
                    0,
                    23,
                    59,
                    59
                ).toISOString()
                const res = await fetch(
                    `${BASE_URL}/api/v1/companies/${ORGANIZATION_ID}/services/${service}/times`,
                    {
                        method: "POST",
                        headers: {
                            "X-API-Key": API_KEY,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ from, to, spots: 1 }),
                    }
                )
                if (!res.ok) throw new Error(`Statut ${res.status}`)
                const js = await res.json()
                const s = new Set<string>()
                Object.values(js.times)
                    .flat()
                    .forEach(
                        (slot: any) =>
                            slot.startTime &&
                            s.add(slot.startTime.split("T")[0])
                    )
                setDates(Array.from(s))
            } catch (e: any) {
                setError(e.message)
            } finally {
                setLoading(false)
            }
        }
        loadSlots()
    }, [year, month, service])

    // Naviguer
    const prev = () =>
        month === 0
            ? (setYear((y) => y - 1), setMonth(11))
            : setMonth((m) => m - 1)
    const next = () =>
        month === 11
            ? (setYear((y) => y + 1), setMonth(0))
            : setMonth((m) => m + 1)
    const goToday = () => {
        setYear(today.getFullYear())
        setMonth(today.getMonth())
    }

    // Sélection date
    const handleSelect = (d: string) => {
        setDateSelected(d)
        setShowForm(true)
    }

    // Formulaire client
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setCustomer((c) => ({
            ...c,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    // Créer réservation
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!customer.terms) {
            alert("Acceptez les CGV")
            return
        }
        try {
            const res = await fetch(`${BASE_URL}/api/v1/request-booking`, {
                method: "POST",
                headers: {
                    "X-API-Key": API_KEY,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    companyID: ORGANIZATION_ID,
                    serviceID: service,
                    resourceID: RESOURCE_ID,
                    startTime: `${dateSelected}T10:00:00.000Z`,
                    client: {
                        firstName: customer.firstName,
                        lastName: customer.lastName,
                        email: customer.email,
                        phone: customer.phone,
                    },
                    spots: 1,
                }),
            })
            if (!res.ok) throw new Error(`Statut ${res.status}`)
            const { paymentUrl } = await res.json()
            window.location.href = paymentUrl
        } catch (e: any) {
            alert(`Erreur réservation: ${e.message}`)
        }
    }

    // Afficher jours
    const renderDays = () => {
        const first = (new Date(year, month, 1).getDay() + 6) % 7
        const total = new Date(year, month + 1, 0).getDate()
        const cells: JSX.Element[] = []
        for (let i = 0; i < first; i++) cells.push(<div key={`b${i}`} />)
        for (let d = 1; d <= total; d++) {
            const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
            const avail = dates.includes(ds)
            const todayMark = ds === formatDateString(today)
            cells.push(
                <div
                    key={ds}
                    className={`day-cell ${avail ? "available" : ""} ${todayMark ? "today" : ""}`}
                    onClick={() => avail && handleSelect(ds)}
                >
                    {d}
                </div>
            )
        }
        return cells
    }

    // Prix total
    const Price = () => {
        const s = SERVICES.find((s) => s.id === service)!
        const total = s.basePrice + s.apaPrice
        return (
            <div className="price-container">
                Prix: {s.basePrice}€ + {s.apaPrice}€ APA → Total: {total}€
            </div>
        )
    }

    return (
        <div className="calendar-container">
            <div className="service-selection">
                <label>Service :</label>
                <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    disabled={loading}
                >
                    {SERVICES.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>
                <Price />
            </div>

            <div className="nav-header">
                <button onClick={prev} disabled={loading}>
                    &lt;
                </button>
                <div className="month-info">
                    <h2>
                        {MONTHS[month]} {year}
                    </h2>
                    <button onClick={goToday} disabled={loading}>
                        Aujourd’hui
                    </button>
                </div>
                <button onClick={next} disabled={loading}>
                    &gt;
                </button>
            </div>

            <div className="weekday-row">
                {WEEKDAYS.map((w) => (
                    <div key={w} className="weekday-cell">
                        {w}
                    </div>
                ))}
            </div>

            <div className="calendar-grid">
                {loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner" />
                        <p>Chargement...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <p>{error}</p>
                        <button onClick={() => setMonth((m) => m)}>
                            Réessayer
                        </button>
                    </div>
                ) : (
                    renderDays()
                )}
            </div>

            {showForm && dateSelected && (
                <div className="form-overlay">
                    <div className="form-container">
                        <h3>Réserver {dateSelected}</h3>
                        <form onSubmit={handleSubmit}>
                            {["firstName", "lastName", "email", "phone"].map(
                                (n) => (
                                    <div key={n} className="form-group">
                                        <label>{n}</label>
                                        <input
                                            name={n}
                                            type={
                                                n === "email" ? "email" : "text"
                                            }
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                )
                            )}
                            <div className="terms">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="terms"
                                        onChange={handleChange}
                                        required
                                    />
                                    J'accepte les CGV
                                </label>
                            </div>
                            <div className="form-actions">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                >
                                    Annuler
                                </button>
                                <button type="submit">Réserver et Payer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="footer">
                <div className="legend">
                    <span>
                        <div className="dot available" /> Disponible
                    </span>
                    <span>
                        <div className="dot today" /> Aujourd’hui
                    </span>
                </div>
            </div>

            {/* Styles intégrés */}
            <style>{`
        @keyframes spin {0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
        .calendar-container {max-width:650px;margin:0 auto;background:#fff;border-radius:20px;box-shadow:0 10px 40px rgba(0,0,0,0.1);padding:30px;font-family:'Inter',sans-serif;}
        .service-selection{text-align:center;margin-bottom:25px;}
        .service-selection select{padding:10px;border-radius:8px;border:1px solid #ddd;}
        .price-container{margin-top:10px;text-align:center;}
        .nav-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;}
        .month-info h2{margin:0;}
        .weekday-row{display:grid;grid-template-columns:repeat(7,1fr);margin-bottom:10px;}
        .weekday-cell{text-align:center;font-weight:600;color:#666;padding:5px 0;}
        .calendar-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;}
        .day-cell{background:#f8fafc;border-radius:8px;display:flex;align-items:center;justify-content:center;height:40px;cursor:pointer;transition:background .2s;}
        .day-cell.available{background:#dcfce7;}
        .day-cell.today{background:#dbeafe;border:2px solid #2563eb;}
        .day-cell:not(.available):hover{background:#eee;}
        .loading-state,.error-state{grid-column:1/8;text-align:center;padding:40px 0;}
        .loading-spinner{width:36px;height:36px;border:4px solid #e5e7eb;border-top:4px solid #3b82f6;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 10px;}
        .form-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;}
        .form-container{background:#fff;border-radius:12px;padding:20px;width:90%;max-width:400px;}
        .form-group{margin-bottom:15px;}
        .form-group label{display:block;margin-bottom:5px;}
        .form-group input{width:100%;padding:8px;border:1px solid #ccc;border-radius:4px;}
        .terms{margin-bottom:15px;}
        .form-actions{display:flex;justify-content:space-between;}
        .form-actions button{padding:8px 16px;border:none;border-radius:4px;cursor:pointer;}
        .form-actions button[type=submit]{background:#16a34a;color:#fff;}
        .footer{margin-top:20px;text-align:center;}
        .legend span{margin:0 10px;display:inline-flex;align-items:center;}
        .dot{width:12px;height:12px;border-radius:50%;margin-right:5px;}
        .dot.available{background:#16a34a;}
        .dot.today{background:#2563eb;}
      `}</style>
        </div>
    )
}

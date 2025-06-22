import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

function formatDateString(date) {
    return date.toISOString().split("T")[0]
}

function formatTimeString(dateTimeString) {
    const date = new Date(dateTimeString)
    return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    })
}

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

export default function BooklaCalendarFramerFinal(props) {
    const {
        // === CONFIGURATION BOOKLA ===
        organizationId = "18566a74-b1ab-4345-948a-517f2ca10f09",
        apiKey = "teVkXn9d17cKZknCZopXDsEPz8SHs2Mf3E7r",
        baseUrl = "https://us.bookla.com",
        resourceId = "8f653843-ae64-4d1a-9701-3a1ab12d133c",

        // === SERVICES ===
        service1Name = "Service Journée",
        service1Price = 300,
        service1ApaPrice = 100,
        service1Id = "e7c09d8e-e012-4b82-8b31-d584fa4be8ae",

        service2Name = "Service Sunset",
        service2Price = 200,
        service2ApaPrice = 50,
        service2Id = "1b994905-1980-4c7d-813a-66fcb8d88f92",

        service3Name = "Service Mix",
        service3Price = 350,
        service3ApaPrice = 120,
        service3Id = "7c3ca43d-37b4-483e-b3f6-39e8aed4afe9",

        // === URLS ===
        successUrl = "https://loupinedou-yacht.fr/confirmation-page",
        cancelUrl = "https://loupinedou-yacht.fr/error-page",
        termsUrl = "https://loupinedou-yacht.fr/conditions",

        // === TEXTES INTERFACE ===
        title = "Réservation de Bateau",
        subtitle = "Sélectionnez une date disponible pour réserver votre service",
        selectServiceLabel = "Sélectionnez votre service :",
        priceLabel = "Prix:",
        apaLabel = "d'APA",
        totalLabel = "Total:",
        todayButtonText = "Aujourd'hui",
        availableText = "Disponible",
        loadingText = "Chargement des disponibilités...",
        errorRetryText = "Réessayer",

        // === TEXTES FORMULAIRE ===
        chooseTimeTitle = "Choisissez un horaire",
        bookingFormTitle = "Réservation",
        firstNameLabel = "Prénom",
        lastNameLabel = "Nom",
        emailLabel = "Email",
        phoneLabel = "Téléphone",
        summaryTitle = "Récapitulatif",
        termsText = "J'accepte les",
        termsLinkText = "conditions générales",
        backButtonText = "Retour",
        bookButtonText = "Réserver",
        cancelButtonText = "Annuler",
        bookingLoadingText = "Création en cours...",

        // === TEXTES SUCCÈS ===
        successTitle = "Réservation créée !",
        successBookingIdLabel = "ID de réservation:",
        successStatusLabel = "Statut:",
        successMethodLabel = "Méthode de paiement:",
        successServiceLabel = "Service:",
        successDateLabel = "Date:",
        successTimeLabel = "Horaire:",
        successTotalLabel = "Total:",
        paymentRedirectText = "Redirection vers paiement en cours...",
        paymentRedirectSubtext = "Vous serez redirigé automatiquement dans 3 secondes.",
        paymentButtonText = "Procéder au paiement maintenant",
        manualPaymentTitle = "Paiement automatique indisponible",
        manualPaymentText = "Votre réservation est créée et sécurisée.",
        closeButtonText = "Fermer et actualiser",

        // === COULEURS ===
        primaryColor = "#16a34a",
        secondaryColor = "#f1f5f9",
        backgroundColor = "#ffffff",
        textColor = "#374151",
        borderColor = "#e2e8f0",
        successColor = "#16a34a",
        errorColor = "#dc2626",
        availableDateColor = "#dcfce7",
        availableDateBorderColor = "#bbf7d0",
        currentDayColor = "#16a34a",
        currentDayBackgroundColor = "#16a34a20",

        // === TYPOGRAPHIE ===
        fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        titleFontSize = 28,
        subtitleFontSize = 18,
        labelFontSize = 18,
        textFontSize = 16,
        smallTextFontSize = 14,
        buttonFontSize = 16,

        // === DIMENSIONS ===
        borderRadius = 12,
        padding = 32,
        gap = 16,
        buttonPadding = 12,
        inputPadding = 12,
        width = 800,
        height = 900,

        // === AFFICHAGE ===
        showBadge = true,
        badgeText = "Frontend-Only",
        badgeColor = "#8b5cf6",
        animationSpeed = 300,
    } = props

    const today = new Date()
    const [currentYear, setCurrentYear] = React.useState(today.getFullYear())
    const [currentMonth, setCurrentMonth] = React.useState(today.getMonth())
    const [selectedServiceId, setSelectedServiceId] = React.useState(service1Id)
    const [availableSlots, setAvailableSlots] = React.useState({})
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState(null)

    // États pour la réservation
    const [selectedDate, setSelectedDate] = React.useState(null)
    const [selectedTimeSlot, setSelectedTimeSlot] = React.useState(null)
    const [showTimeSelection, setShowTimeSelection] = React.useState(false)
    const [showBookingForm, setShowBookingForm] = React.useState(false)
    const [isBooking, setIsBooking] = React.useState(false)
    const [bookingSuccess, setBookingSuccess] = React.useState(null)
    const [customerInfo, setCustomerInfo] = React.useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        termsAccepted: false,
    })

    // Configuration des services dynamique
    const SERVICES = [
        {
            id: service1Id,
            name: service1Name,
            basePrice: service1Price,
            apaPrice: service1ApaPrice,
        },
        {
            id: service2Id,
            name: service2Name,
            basePrice: service2Price,
            apaPrice: service2ApaPrice,
        },
        {
            id: service3Id,
            name: service3Name,
            basePrice: service3Price,
            apaPrice: service3ApaPrice,
        },
    ]

    // Configuration des URLs dynamiques
    const URLS = {
        success: successUrl,
        cancel: cancelUrl,
        terms: termsUrl,
    }

    // Hook pour récupérer les disponibilités
    React.useEffect(() => {
        const fetchAvailability = async () => {
            setLoading(true)
            setError(null)

            try {
                const startOfMonth = new Date(currentYear, currentMonth, 1)
                const endOfMonth = new Date(
                    currentYear,
                    currentMonth + 1,
                    0,
                    23,
                    59,
                    59
                )

                const fromDate = startOfMonth.toISOString()
                const toDate = endOfMonth.toISOString()

                console.log(
                    `📅 Récupération disponibilités: ${fromDate} → ${toDate}`
                )

                const apiUrl = `${baseUrl}/api/v1/companies/${organizationId}/services/${selectedServiceId}/times`

                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "X-API-Key": apiKey,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        from: fromDate,
                        to: toDate,
                        spots: 1,
                    }),
                })

                if (!response.ok) {
                    throw new Error(`Erreur API Bookla: ${response.status}`)
                }

                const apiData = await response.json()
                const slotsGroupedByDate = {}

                if (apiData && apiData.times) {
                    Object.entries(apiData.times).forEach(
                        ([resourceIdFromApi, resourceSlots]) => {
                            if (Array.isArray(resourceSlots)) {
                                resourceSlots.forEach((slot) => {
                                    if (slot.startTime) {
                                        const slotDate =
                                            slot.startTime.split("T")[0]
                                        if (!slotsGroupedByDate[slotDate]) {
                                            slotsGroupedByDate[slotDate] = []
                                        }
                                        slotsGroupedByDate[slotDate].push({
                                            startTime: slot.startTime,
                                            endTime: slot.endTime,
                                            resourceId: resourceIdFromApi,
                                        })
                                    }
                                })
                            }
                        }
                    )
                }

                // Trier les créneaux par heure
                Object.keys(slotsGroupedByDate).forEach((date) => {
                    slotsGroupedByDate[date].sort(
                        (a, b) =>
                            new Date(a.startTime).getTime() -
                            new Date(b.startTime).getTime()
                    )
                })

                console.log(
                    `✅ ${Object.keys(slotsGroupedByDate).length} dates disponibles`
                )
                setAvailableSlots(slotsGroupedByDate)
            } catch (err) {
                console.error("❌ Erreur chargement disponibilités:", err)
                setError(
                    err.message || "Impossible de charger les disponibilités"
                )
            } finally {
                setLoading(false)
            }
        }

        fetchAvailability()
    }, [
        currentYear,
        currentMonth,
        selectedServiceId,
        organizationId,
        apiKey,
        baseUrl,
    ])

    // Workflow de réservation Frontend-Only
    const handleBookingFrontendOnly = async (e) => {
        e.preventDefault()

        if (!customerInfo.termsAccepted) {
            alert("Vous devez accepter les conditions générales")
            return
        }

        if (!selectedTimeSlot) {
            alert("Aucun créneau sélectionné")
            return
        }

        setIsBooking(true)

        try {
            const service = SERVICES.find((s) => s.id === selectedServiceId)
            if (!service) throw new Error("Service non trouvé")

            console.log("🚀 === WORKFLOW FRONTEND-ONLY FRAMER ===")

            // ÉTAPE 1: Créer réservation
            const bookingPayload = {
                companyID: organizationId,
                serviceID: selectedServiceId,
                resourceID: selectedTimeSlot.resourceId || resourceId,
                startTime: selectedTimeSlot.startTime,
                endTime: selectedTimeSlot.endTime,
                client: {
                    firstName: customerInfo.firstName,
                    lastName: customerInfo.lastName,
                    email: customerInfo.email,
                    phone: customerInfo.phone,
                },
                spots: 1,
                status: "pending",
                requirePayment: true,
                termsAccepted: customerInfo.termsAccepted,
                metadata: {
                    source: "framer_final",
                    payment_method: "bookla_integrated",
                    domain: window.location.hostname,
                    total_amount: (
                        service.basePrice + service.apaPrice
                    ).toString(),
                    service_name: service.name,
                    created_at: new Date().toISOString(),
                },
            }

            const bookingResponse = await fetch(
                `${baseUrl}/api/v1/companies/${organizationId}/bookings`,
                {
                    method: "POST",
                    headers: {
                        "X-API-Key": apiKey,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(bookingPayload),
                }
            )

            if (!bookingResponse.ok) {
                throw new Error(
                    `Erreur création réservation: ${bookingResponse.status}`
                )
            }

            const bookingData = await bookingResponse.json()
            const bookingId =
                bookingData.id ||
                bookingData.bookingId ||
                bookingData.booking?.id
            const status =
                bookingData.status ||
                bookingData.booking?.status ||
                bookingData.state

            console.log(`✅ Réservation créée: ID=${bookingId}`)

            // ÉTAPE 2: Créer paiement
            const paymentPayload = {
                bookingId: bookingId,
                amount: (service.basePrice + service.apaPrice) * 100,
                currency: "EUR",
                description: `Réservation ${service.name} - Framer`,
                successUrl: `${URLS.success}?booking=${bookingId}&payment=success&source=framer`,
                cancelUrl: `${URLS.cancel}?booking=${bookingId}&payment=cancelled&source=framer`,
                metadata: {
                    bookingId: bookingId,
                    source: "framer_final",
                    serviceName: service.name,
                    customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
                    customerEmail: customerInfo.email,
                    totalAmount: (
                        service.basePrice + service.apaPrice
                    ).toString(),
                },
            }

            // Essayer plusieurs endpoints Bookla
            const paymentEndpoints = [
                `${baseUrl}/api/v1/companies/${organizationId}/bookings/${bookingId}/payment`,
                `${baseUrl}/api/v1/companies/${organizationId}/bookings/${bookingId}/checkout`,
                `${baseUrl}/api/v1/companies/${organizationId}/payments`,
            ]

            let paymentSuccess = false
            let paymentUrl = null

            for (const endpoint of paymentEndpoints) {
                try {
                    console.log(`🎯 Tentative paiement: ${endpoint}`)

                    const paymentResponse = await fetch(endpoint, {
                        method: "POST",
                        headers: {
                            "X-API-Key": apiKey,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(paymentPayload),
                    })

                    if (paymentResponse.ok) {
                        const paymentData = await paymentResponse.json()
                        paymentUrl =
                            paymentData.url ||
                            paymentData.paymentUrl ||
                            paymentData.checkout_url ||
                            paymentData.payment_url

                        if (
                            paymentUrl &&
                            (paymentUrl.includes("stripe.com") ||
                                paymentUrl.includes("checkout"))
                        ) {
                            console.log("🎉 URL PAIEMENT OBTENUE!", paymentUrl)
                            paymentSuccess = true
                            break
                        }
                    }
                } catch (error) {
                    console.log(`💥 Erreur endpoint ${endpoint}:`, error)
                }
            }

            // Afficher le résultat
            if (paymentSuccess && paymentUrl) {
                setBookingSuccess({
                    bookingId,
                    status,
                    paymentUrl,
                    paymentMethod: "bookla-integrated",
                })

                // Redirection automatique
                setTimeout(() => {
                    console.log("🚀 Redirection vers paiement...")
                    window.open(paymentUrl, "_blank")
                }, 3000)
            } else {
                setBookingSuccess({
                    bookingId,
                    status,
                    manualPayment: true,
                    paymentMethod: "manual",
                })
            }

            // Nettoyer le formulaire
            setShowBookingForm(false)
            setShowTimeSelection(false)
            setSelectedDate(null)
            setSelectedTimeSlot(null)
            setCustomerInfo({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                termsAccepted: false,
            })
        } catch (error) {
            console.error("❌ ERREUR CRITIQUE:", error)
            alert(`Erreur: ${error.message}`)
        } finally {
            setIsBooking(false)
        }
    }

    // Génération des jours du calendrier
    const generateCalendarDays = () => {
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
        const totalDaysInMonth = lastDayOfMonth.getDate()
        const startingWeekday = (firstDayOfMonth.getDay() + 6) % 7

        const calendarDays = []

        // Jours vides au début
        for (let emptyDay = 0; emptyDay < startingWeekday; emptyDay++) {
            calendarDays.push(
                <div
                    key={`empty-${emptyDay}`}
                    style={{ aspectRatio: "1" }}
                ></div>
            )
        }

        // Jours du mois
        for (let dayNumber = 1; dayNumber <= totalDaysInMonth; dayNumber++) {
            const currentDate = new Date(currentYear, currentMonth, dayNumber)
            const dateString = formatDateString(currentDate)
            const daySlots = availableSlots[dateString] || []
            const isDateAvailable = daySlots.length > 0
            const isCurrentDay =
                currentDate.toDateString() === today.toDateString()
            const isPastDate = currentDate < today

            let dayStyle = {
                aspectRatio: "1",
                backgroundColor: isDateAvailable
                    ? availableDateColor
                    : secondaryColor,
                borderRadius: `${borderRadius * 0.75}px`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                cursor: isDateAvailable && !isPastDate ? "pointer" : "default",
                border: `2px solid ${isDateAvailable ? availableDateBorderColor : "transparent"}`,
                transition: `all ${animationSpeed}ms ease`,
                opacity: isPastDate ? 0.3 : 1,
                fontFamily: fontFamily,
                fontSize: `${textFontSize}px`,
                color: textColor,
            }

            if (isCurrentDay) {
                dayStyle.border = `2px solid ${currentDayColor}`
                dayStyle.backgroundColor = currentDayBackgroundColor
                dayStyle.fontWeight = "bold"
            }

            calendarDays.push(
                <div
                    key={`day-${dateString}`}
                    style={dayStyle}
                    onClick={() => {
                        if (isDateAvailable && !isPastDate) {
                            setSelectedDate(dateString)
                            setSelectedTimeSlot(null)
                            setShowTimeSelection(true)
                        }
                    }}
                >
                    <span style={{ fontWeight: "500" }}>{dayNumber}</span>
                    {isDateAvailable && (
                        <div
                            style={{
                                width: "8px",
                                height: "8px",
                                backgroundColor: successColor,
                                borderRadius: "50%",
                                marginTop: "4px",
                            }}
                        ></div>
                    )}
                    {isDateAvailable && daySlots.length > 1 && (
                        <span
                            style={{
                                fontSize: `${smallTextFontSize}px`,
                                color: successColor,
                                fontWeight: "500",
                            }}
                        >
                            {daySlots.length}
                        </span>
                    )}
                </div>
            )
        }

        return calendarDays
    }

    // Styles dynamiques
    const containerStyle = {
        width: width,
        height: height,
        maxWidth: "100%",
        backgroundColor: backgroundColor,
        borderRadius: `${borderRadius}px`,
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
        padding: `${padding}px`,
        fontFamily: fontFamily,
        fontSize: `${textFontSize}px`,
        color: textColor,
        overflow: "auto",
        position: "relative",
    }

    const badgeStyle = showBadge
        ? {
              position: "absolute",
              top: `${gap}px`,
              right: `${gap}px`,
              backgroundColor: badgeColor,
              color: "white",
              padding: `${gap * 0.5}px ${gap * 0.75}px`,
              borderRadius: `${borderRadius * 0.5}px`,
              fontSize: `${smallTextFontSize}px`,
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              zIndex: 10,
          }
        : { display: "none" }

    return (
        <div style={containerStyle}>
            <style>{`
                @keyframes spin-final {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>

            {/* Badge Frontend-Only */}
            <div style={badgeStyle}>{badgeText}</div>

            {/* En-tête */}
            <div style={{ textAlign: "center", marginBottom: `${gap * 2}px` }}>
                <h1
                    style={{
                        fontSize: `${titleFontSize}px`,
                        fontWeight: "700",
                        marginBottom: `${gap * 0.5}px`,
                        lineHeight: "1.3",
                        margin: `0 0 ${gap * 0.5}px 0`,
                    }}
                >
                    {title}
                </h1>
                <p
                    style={{
                        fontSize: `${subtitleFontSize}px`,
                        color: `${textColor}99`,
                        marginBottom: "0",
                        margin: "0",
                    }}
                >
                    {subtitle}
                </p>
            </div>

            {/* Sélection du service */}
            <div style={{ marginBottom: `${gap * 2}px`, textAlign: "center" }}>
                <label
                    style={{
                        display: "block",
                        marginBottom: `${gap}px`,
                        fontWeight: "600",
                        fontSize: `${labelFontSize}px`,
                    }}
                >
                    {selectServiceLabel}
                </label>
                <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    style={{
                        padding: `${inputPadding}px ${inputPadding * 1.25}px`,
                        borderRadius: `${borderRadius * 0.75}px`,
                        border: `2px solid ${borderColor}`,
                        backgroundColor: backgroundColor,
                        color: textColor,
                        fontSize: `${textFontSize}px`,
                        fontFamily: fontFamily,
                        width: "100%",
                        maxWidth: "400px",
                        cursor: "pointer",
                        outline: "none",
                    }}
                    disabled={loading}
                >
                    {SERVICES.map((service) => (
                        <option key={service.id} value={service.id}>
                            {service.name}
                        </option>
                    ))}
                </select>

                {SERVICES.find((s) => s.id === selectedServiceId) && (
                    <div
                        style={{
                            marginTop: `${gap}px`,
                            padding: `${gap}px`,
                            backgroundColor: secondaryColor,
                            borderRadius: `${borderRadius * 0.75}px`,
                            textAlign: "center",
                            maxWidth: "400px",
                            margin: `${gap}px auto 0`,
                        }}
                    >
                        <div>
                            <span>{priceLabel} </span>
                            <span style={{ fontWeight: "600" }}>
                                {
                                    SERVICES.find(
                                        (s) => s.id === selectedServiceId
                                    ).basePrice
                                }
                                € +{" "}
                                {
                                    SERVICES.find(
                                        (s) => s.id === selectedServiceId
                                    ).apaPrice
                                }
                                € {apaLabel}
                            </span>
                        </div>
                        <div
                            style={{
                                fontSize: `${titleFontSize * 0.9}px`,
                                fontWeight: "700",
                                color: primaryColor,
                                marginTop: `${gap * 0.5}px`,
                            }}
                        >
                            {totalLabel}{" "}
                            {SERVICES.find((s) => s.id === selectedServiceId)
                                .basePrice +
                                SERVICES.find((s) => s.id === selectedServiceId)
                                    .apaPrice}
                            €
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation du calendrier */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: `${gap * 2}px`,
                }}
            >
                <button
                    onClick={() => {
                        if (currentMonth === 0) {
                            setCurrentYear((prev) => prev - 1)
                            setCurrentMonth(11)
                        } else {
                            setCurrentMonth((prev) => prev - 1)
                        }
                    }}
                    style={{
                        backgroundColor: secondaryColor,
                        border: "none",
                        borderRadius: `${borderRadius * 0.75}px`,
                        fontSize: `${buttonFontSize * 1.5}px`,
                        fontWeight: "bold",
                        cursor: "pointer",
                        width: "48px",
                        height: "48px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: textColor,
                        transition: `all ${animationSpeed}ms ease`,
                    }}
                    disabled={loading}
                >
                    &#8249;
                </button>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: `${gap}px`,
                    }}
                >
                    <h2
                        style={{
                            fontSize: `${titleFontSize * 0.9}px`,
                            fontWeight: "700",
                            textAlign: "center",
                            margin: "0",
                        }}
                    >
                        {MONTHS[currentMonth]} {currentYear}
                    </h2>
                    <button
                        onClick={() => {
                            setCurrentYear(today.getFullYear())
                            setCurrentMonth(today.getMonth())
                        }}
                        style={{
                            backgroundColor: primaryColor,
                            color: "white",
                            padding: `${buttonPadding * 0.75}px ${buttonPadding * 1.25}px`,
                            borderRadius: `${borderRadius * 0.75}px`,
                            fontWeight: "600",
                            cursor: "pointer",
                            border: "none",
                            transition: `all ${animationSpeed}ms ease`,
                            fontSize: `${buttonFontSize}px`,
                            fontFamily: fontFamily,
                        }}
                        disabled={loading}
                    >
                        {todayButtonText}
                    </button>
                </div>

                <button
                    onClick={() => {
                        if (currentMonth === 11) {
                            setCurrentYear((prev) => prev + 1)
                            setCurrentMonth(0)
                        } else {
                            setCurrentMonth((prev) => prev + 1)
                        }
                    }}
                    style={{
                        backgroundColor: secondaryColor,
                        border: "none",
                        borderRadius: `${borderRadius * 0.75}px`,
                        fontSize: `${buttonFontSize * 1.5}px`,
                        fontWeight: "bold",
                        cursor: "pointer",
                        width: "48px",
                        height: "48px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: textColor,
                        transition: `all ${animationSpeed}ms ease`,
                    }}
                    disabled={loading}
                >
                    &#8250;
                </button>
            </div>

            {/* En-têtes des jours */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: `${gap * 0.5}px`,
                    marginBottom: `${gap}px`,
                }}
            >
                {WEEKDAYS.map((weekday) => (
                    <div
                        key={weekday}
                        style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            padding: `${gap * 0.5}px 0`,
                            fontSize: `${smallTextFontSize}px`,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                        }}
                    >
                        {weekday}
                    </div>
                ))}
            </div>

            {/* Grille du calendrier */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: `${gap * 0.5}px`,
                    minHeight: "350px",
                }}
            >
                {loading ? (
                    <div
                        style={{
                            gridColumn: "1 / -1",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "80px 0",
                            gap: `${gap}px`,
                        }}
                    >
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                border: `4px solid ${secondaryColor}`,
                                borderTop: `4px solid ${primaryColor}`,
                                borderRadius: "50%",
                                animation: "spin-final 1s linear infinite",
                            }}
                        ></div>
                        <p
                            style={{
                                fontSize: `${textFontSize}px`,
                                fontWeight: "500",
                                margin: "0",
                            }}
                        >
                            {loadingText}
                        </p>
                    </div>
                ) : error ? (
                    <div
                        style={{
                            gridColumn: "1 / -1",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "80px 0",
                            gap: `${gap}px`,
                            textAlign: "center",
                        }}
                    >
                        <div style={{ fontSize: "60px" }}>⚠️</div>
                        <p
                            style={{
                                color: errorColor,
                                fontWeight: "600",
                                maxWidth: "400px",
                                margin: "0",
                            }}
                        >
                            {error}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                backgroundColor: primaryColor,
                                color: "white",
                                padding: `${buttonPadding}px ${buttonPadding * 2}px`,
                                borderRadius: `${borderRadius * 0.75}px`,
                                fontWeight: "600",
                                cursor: "pointer",
                                border: "none",
                                transition: `all ${animationSpeed}ms ease`,
                                fontSize: `${buttonFontSize}px`,
                                fontFamily: fontFamily,
                            }}
                        >
                            {errorRetryText}
                        </button>
                    </div>
                ) : (
                    generateCalendarDays()
                )}
            </div>

            {/* Légende */}
            <div
                style={{
                    marginTop: `${gap * 2}px`,
                    paddingTop: `${gap * 1.5}px`,
                    borderTop: `2px solid ${borderColor}`,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: `${gap * 2}px`,
                        marginBottom: `${gap}px`,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: `${gap * 0.75}px`,
                        }}
                    >
                        <div
                            style={{
                                width: "12px",
                                height: "12px",
                                backgroundColor: successColor,
                                borderRadius: "50%",
                            }}
                        ></div>
                        <span>{availableText}</span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: `${gap * 0.75}px`,
                        }}
                    >
                        <div
                            style={{
                                width: "12px",
                                height: "12px",
                                backgroundColor: currentDayColor,
                                borderRadius: "50%",
                            }}
                        ></div>
                        <span>{todayButtonText}</span>
                    </div>
                </div>

                {!loading &&
                    !error &&
                    !showBookingForm &&
                    !showTimeSelection &&
                    !bookingSuccess && (
                        <div style={{ textAlign: "center" }}>
                            <p
                                style={{
                                    fontWeight: "600",
                                    margin: `0 0 ${gap}px 0`,
                                }}
                            >
                                {
                                    Object.keys(availableSlots).filter(
                                        (date) =>
                                            availableSlots[date].length > 0
                                    ).length
                                }{" "}
                                jour
                                {Object.keys(availableSlots).filter(
                                    (date) => availableSlots[date].length > 0
                                ).length !== 1
                                    ? "s"
                                    : ""}{" "}
                                disponible
                                {Object.keys(availableSlots).filter(
                                    (date) => availableSlots[date].length > 0
                                ).length !== 1
                                    ? "s"
                                    : ""}{" "}
                                pour{" "}
                                {
                                    SERVICES.find(
                                        (s) => s.id === selectedServiceId
                                    )?.name
                                }
                            </p>
                            <div
                                style={{
                                    padding: `${gap}px`,
                                    backgroundColor: `${badgeColor}20`,
                                    borderRadius: `${borderRadius * 0.75}px`,
                                    border: `1px solid ${badgeColor}50`,
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: `${smallTextFontSize}px`,
                                        color: badgeColor,
                                        fontWeight: "600",
                                        margin: "0",
                                    }}
                                >
                                    🎯 <strong>{badgeText}:</strong> Aucun
                                    backend nécessaire !
                                </p>
                            </div>
                        </div>
                    )}
            </div>

            {/* Modal de sélection d'horaire */}
            {showTimeSelection && selectedDate && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                        padding: `${gap}px`,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: backgroundColor,
                            borderRadius: `${borderRadius}px`,
                            padding: `${padding}px`,
                            width: "100%",
                            maxWidth: "400px",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
                        }}
                    >
                        <h3
                            style={{
                                fontSize: `${titleFontSize * 0.8}px`,
                                fontWeight: "700",
                                textAlign: "center",
                                marginBottom: `${gap * 0.5}px`,
                                margin: `0 0 ${gap * 0.5}px 0`,
                            }}
                        >
                            {chooseTimeTitle}
                        </h3>
                        <p
                            style={{
                                textAlign: "center",
                                marginBottom: `${gap * 1.5}px`,
                                color: `${textColor}99`,
                                margin: `0 0 ${gap * 1.5}px 0`,
                            }}
                        >
                            Date: {selectedDate}
                        </p>

                        <div style={{ marginBottom: `${gap * 1.5}px` }}>
                            {(availableSlots[selectedDate] || []).map(
                                (slot, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setSelectedTimeSlot(slot)
                                            setShowTimeSelection(false)
                                            setShowBookingForm(true)
                                        }}
                                        style={{
                                            width: "100%",
                                            padding: `${buttonPadding}px`,
                                            border: `2px solid ${borderColor}`,
                                            borderRadius: `${borderRadius * 0.75}px`,
                                            backgroundColor: backgroundColor,
                                            color: textColor,
                                            cursor: "pointer",
                                            transition: `all ${animationSpeed}ms ease`,
                                            textAlign: "left",
                                            marginBottom: `${gap * 0.75}px`,
                                            fontSize: `${textFontSize}px`,
                                            fontFamily: fontFamily,
                                        }}
                                    >
                                        <div style={{ fontWeight: "600" }}>
                                            {formatTimeString(slot.startTime)}
                                            {slot.endTime &&
                                                ` - ${formatTimeString(slot.endTime)}`}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: `${smallTextFontSize}px`,
                                                color: `${textColor}99`,
                                            }}
                                        >
                                            {
                                                SERVICES.find(
                                                    (s) =>
                                                        s.id ===
                                                        selectedServiceId
                                                )?.name
                                            }
                                        </div>
                                    </button>
                                )
                            )}
                        </div>

                        <button
                            onClick={() => setShowTimeSelection(false)}
                            style={{
                                width: "100%",
                                padding: `${buttonPadding}px`,
                                backgroundColor: secondaryColor,
                                color: textColor,
                                borderRadius: `${borderRadius * 0.75}px`,
                                fontWeight: "600",
                                border: "none",
                                cursor: "pointer",
                                transition: `all ${animationSpeed}ms ease`,
                                fontSize: `${buttonFontSize}px`,
                                fontFamily: fontFamily,
                            }}
                        >
                            {cancelButtonText}
                        </button>
                    </div>
                </div>
            )}

            {/* Modal formulaire de réservation */}
            {showBookingForm && selectedDate && selectedTimeSlot && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                        padding: `${gap}px`,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: backgroundColor,
                            borderRadius: `${borderRadius}px`,
                            padding: `${padding}px`,
                            width: "100%",
                            maxWidth: "500px",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
                        }}
                    >
                        <h3
                            style={{
                                fontSize: `${titleFontSize * 0.8}px`,
                                fontWeight: "700",
                                textAlign: "center",
                                marginBottom: `${gap * 0.5}px`,
                                margin: `0 0 ${gap * 0.5}px 0`,
                            }}
                        >
                            {bookingFormTitle} -{" "}
                            {
                                SERVICES.find((s) => s.id === selectedServiceId)
                                    ?.name
                            }
                        </h3>
                        <p
                            style={{
                                textAlign: "center",
                                marginBottom: `${gap * 0.5}px`,
                                color: `${textColor}99`,
                                margin: `0 0 ${gap * 0.5}px 0`,
                            }}
                        >
                            Date: {selectedDate}
                        </p>
                        <p
                            style={{
                                textAlign: "center",
                                marginBottom: `${gap * 1.5}px`,
                                color: `${textColor}99`,
                                margin: `0 0 ${gap * 1.5}px 0`,
                            }}
                        >
                            Horaire:{" "}
                            {formatTimeString(selectedTimeSlot.startTime)}
                            {selectedTimeSlot.endTime &&
                                ` - ${formatTimeString(selectedTimeSlot.endTime)}`}
                        </p>

                        <form
                            onSubmit={handleBookingFrontendOnly}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: `${gap}px`,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: `${gap * 0.5}px`,
                                }}
                            >
                                <label
                                    style={{
                                        fontWeight: "600",
                                        fontSize: `${labelFontSize}px`,
                                    }}
                                >
                                    {firstNameLabel} *
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={customerInfo.firstName}
                                    onChange={(e) =>
                                        setCustomerInfo({
                                            ...customerInfo,
                                            firstName: e.target.value,
                                        })
                                    }
                                    style={{
                                        padding: `${inputPadding}px`,
                                        borderRadius: `${borderRadius * 0.75}px`,
                                        border: `1px solid ${borderColor}`,
                                        backgroundColor: backgroundColor,
                                        color: textColor,
                                        fontSize: `${textFontSize}px`,
                                        fontFamily: fontFamily,
                                        outline: "none",
                                    }}
                                    required
                                />
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: `${gap * 0.5}px`,
                                }}
                            >
                                <label
                                    style={{
                                        fontWeight: "600",
                                        fontSize: `${labelFontSize}px`,
                                    }}
                                >
                                    {lastNameLabel} *
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={customerInfo.lastName}
                                    onChange={(e) =>
                                        setCustomerInfo({
                                            ...customerInfo,
                                            lastName: e.target.value,
                                        })
                                    }
                                    style={{
                                        padding: `${inputPadding}px`,
                                        borderRadius: `${borderRadius * 0.75}px`,
                                        border: `1px solid ${borderColor}`,
                                        backgroundColor: backgroundColor,
                                        color: textColor,
                                        fontSize: `${textFontSize}px`,
                                        fontFamily: fontFamily,
                                        outline: "none",
                                    }}
                                    required
                                />
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: `${gap * 0.5}px`,
                                }}
                            >
                                <label
                                    style={{
                                        fontWeight: "600",
                                        fontSize: `${labelFontSize}px`,
                                    }}
                                >
                                    {emailLabel} *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={customerInfo.email}
                                    onChange={(e) =>
                                        setCustomerInfo({
                                            ...customerInfo,
                                            email: e.target.value,
                                        })
                                    }
                                    style={{
                                        padding: `${inputPadding}px`,
                                        borderRadius: `${borderRadius * 0.75}px`,
                                        border: `1px solid ${borderColor}`,
                                        backgroundColor: backgroundColor,
                                        color: textColor,
                                        fontSize: `${textFontSize}px`,
                                        fontFamily: fontFamily,
                                        outline: "none",
                                    }}
                                    required
                                />
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: `${gap * 0.5}px`,
                                }}
                            >
                                <label
                                    style={{
                                        fontWeight: "600",
                                        fontSize: `${labelFontSize}px`,
                                    }}
                                >
                                    {phoneLabel} *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={customerInfo.phone}
                                    onChange={(e) =>
                                        setCustomerInfo({
                                            ...customerInfo,
                                            phone: e.target.value,
                                        })
                                    }
                                    style={{
                                        padding: `${inputPadding}px`,
                                        borderRadius: `${borderRadius * 0.75}px`,
                                        border: `1px solid ${borderColor}`,
                                        backgroundColor: backgroundColor,
                                        color: textColor,
                                        fontSize: `${textFontSize}px`,
                                        fontFamily: fontFamily,
                                        outline: "none",
                                    }}
                                    required
                                />
                            </div>

                            {SERVICES.find(
                                (s) => s.id === selectedServiceId
                            ) && (
                                <div
                                    style={{
                                        padding: `${gap}px`,
                                        backgroundColor: secondaryColor,
                                        borderRadius: `${borderRadius * 0.75}px`,
                                        border: `1px solid ${borderColor}`,
                                    }}
                                >
                                    <h4
                                        style={{
                                            fontWeight: "600",
                                            textAlign: "center",
                                            marginBottom: `${gap * 0.75}px`,
                                            margin: `0 0 ${gap * 0.75}px 0`,
                                            fontSize: `${labelFontSize}px`,
                                        }}
                                    >
                                        {summaryTitle}
                                    </h4>
                                    <div style={{ textAlign: "center" }}>
                                        <div>
                                            <span>{priceLabel} </span>
                                            <span style={{ fontWeight: "600" }}>
                                                {
                                                    SERVICES.find(
                                                        (s) =>
                                                            s.id ===
                                                            selectedServiceId
                                                    ).basePrice
                                                }
                                                € +{" "}
                                                {
                                                    SERVICES.find(
                                                        (s) =>
                                                            s.id ===
                                                            selectedServiceId
                                                    ).apaPrice
                                                }
                                                € {apaLabel}
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                fontSize: `${titleFontSize * 0.8}px`,
                                                fontWeight: "700",
                                                color: primaryColor,
                                                marginTop: `${gap * 0.5}px`,
                                            }}
                                        >
                                            {totalLabel}{" "}
                                            {SERVICES.find(
                                                (s) =>
                                                    s.id === selectedServiceId
                                            ).basePrice +
                                                SERVICES.find(
                                                    (s) =>
                                                        s.id ===
                                                        selectedServiceId
                                                ).apaPrice}
                                            €
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div
                                style={{
                                    padding: `${gap}px`,
                                    backgroundColor: secondaryColor,
                                    borderRadius: `${borderRadius * 0.75}px`,
                                    border: `1px solid ${borderColor}`,
                                }}
                            >
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: `${gap * 0.75}px`,
                                        cursor: "pointer",
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        name="termsAccepted"
                                        checked={customerInfo.termsAccepted}
                                        onChange={(e) =>
                                            setCustomerInfo({
                                                ...customerInfo,
                                                termsAccepted: e.target.checked,
                                            })
                                        }
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            cursor: "pointer",
                                        }}
                                        required
                                    />
                                    <span
                                        style={{
                                            fontSize: `${smallTextFontSize}px`,
                                        }}
                                    >
                                        {termsText}{" "}
                                        <a
                                            href={URLS.terms}
                                            style={{
                                                color: primaryColor,
                                                textDecoration: "underline",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {termsLinkText}
                                        </a>{" "}
                                        *
                                    </span>
                                </label>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: `${gap}px`,
                                    marginTop: `${gap * 1.5}px`,
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowBookingForm(false)
                                        setShowTimeSelection(true)
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: `${buttonPadding}px`,
                                        backgroundColor: secondaryColor,
                                        color: textColor,
                                        borderRadius: `${borderRadius * 0.75}px`,
                                        fontWeight: "600",
                                        border: "none",
                                        cursor: "pointer",
                                        transition: `all ${animationSpeed}ms ease`,
                                        fontSize: `${buttonFontSize}px`,
                                        fontFamily: fontFamily,
                                    }}
                                    disabled={isBooking}
                                >
                                    {backButtonText}
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        flex: 2,
                                        padding: `${buttonPadding}px`,
                                        backgroundColor: primaryColor,
                                        color: "white",
                                        borderRadius: `${borderRadius * 0.75}px`,
                                        fontWeight: "600",
                                        border: "none",
                                        cursor: isBooking
                                            ? "default"
                                            : "pointer",
                                        transition: `all ${animationSpeed}ms ease`,
                                        fontSize: `${buttonFontSize}px`,
                                        fontFamily: fontFamily,
                                        opacity: isBooking ? 0.7 : 1,
                                    }}
                                    disabled={isBooking}
                                >
                                    {isBooking
                                        ? bookingLoadingText
                                        : bookButtonText}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de succès */}
            {bookingSuccess && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                        padding: `${gap}px`,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: backgroundColor,
                            borderRadius: `${borderRadius}px`,
                            padding: `${padding}px`,
                            width: "100%",
                            maxWidth: "500px",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
                        }}
                    >
                        <h3
                            style={{
                                fontSize: `${titleFontSize * 0.8}px`,
                                fontWeight: "700",
                                textAlign: "center",
                                marginBottom: `${gap}px`,
                                margin: `0 0 ${gap}px 0`,
                                color: successColor,
                            }}
                        >
                            🎉 {successTitle}
                        </h3>

                        <div style={{ marginBottom: `${gap * 1.5}px` }}>
                            <div
                                style={{
                                    padding: `${gap}px`,
                                    backgroundColor: `${successColor}20`,
                                    borderRadius: `${borderRadius * 0.75}px`,
                                    border: `1px solid ${successColor}40`,
                                    marginBottom: `${gap}px`,
                                }}
                            >
                                <p
                                    style={{
                                        margin: "0",
                                        marginBottom: `${gap * 0.5}px`,
                                    }}
                                >
                                    <strong>{successBookingIdLabel}</strong>{" "}
                                    {bookingSuccess.bookingId}
                                </p>
                                <p
                                    style={{
                                        margin: "0",
                                        marginBottom: `${gap * 0.5}px`,
                                    }}
                                >
                                    <strong>{successStatusLabel}</strong>
                                    <span
                                        style={{
                                            fontWeight: "600",
                                            marginLeft: "8px",
                                            color: successColor,
                                        }}
                                    >
                                        {bookingSuccess.status} ✅
                                    </span>
                                </p>
                                <p
                                    style={{
                                        margin: "0",
                                        marginBottom: `${gap * 0.5}px`,
                                    }}
                                >
                                    <strong>{successMethodLabel}</strong>
                                    <span
                                        style={{
                                            fontWeight: "600",
                                            marginLeft: "8px",
                                            color: primaryColor,
                                        }}
                                    >
                                        {bookingSuccess.paymentMethod ===
                                            "bookla-integrated" &&
                                            "🎯 Bookla Intégré (Frontend-Only)"}
                                        {bookingSuccess.paymentMethod ===
                                            "manual" && "📧 Manuel"}
                                    </span>
                                </p>
                                <p
                                    style={{
                                        margin: "0",
                                        marginBottom: `${gap * 0.5}px`,
                                    }}
                                >
                                    <strong>{successServiceLabel}</strong>{" "}
                                    {
                                        SERVICES.find(
                                            (s) => s.id === selectedServiceId
                                        )?.name
                                    }
                                </p>
                                <p
                                    style={{
                                        margin: "0",
                                        marginBottom: `${gap * 0.5}px`,
                                    }}
                                >
                                    <strong>{successDateLabel}</strong>{" "}
                                    {selectedDate}
                                </p>
                                <p
                                    style={{
                                        margin: "0",
                                        marginBottom: `${gap * 0.5}px`,
                                    }}
                                >
                                    <strong>{successTimeLabel}</strong>{" "}
                                    {selectedTimeSlot &&
                                        formatTimeString(
                                            selectedTimeSlot.startTime
                                        )}
                                </p>
                                <p style={{ margin: "0" }}>
                                    <strong>{successTotalLabel}</strong>{" "}
                                    {(SERVICES.find(
                                        (s) => s.id === selectedServiceId
                                    )?.basePrice || 0) +
                                        (SERVICES.find(
                                            (s) => s.id === selectedServiceId
                                        )?.apaPrice || 0)}
                                    €
                                </p>
                            </div>

                            {bookingSuccess.paymentUrl ? (
                                <div
                                    style={{
                                        padding: `${gap}px`,
                                        backgroundColor: `${primaryColor}20`,
                                        borderRadius: `${borderRadius * 0.75}px`,
                                        border: `1px solid ${primaryColor}40`,
                                    }}
                                >
                                    <p
                                        style={{
                                            color: primaryColor,
                                            fontWeight: "600",
                                            marginBottom: `${gap * 0.5}px`,
                                            margin: `0 0 ${gap * 0.5}px 0`,
                                        }}
                                    >
                                        🔗 {paymentRedirectText}
                                    </p>
                                    <p
                                        style={{
                                            fontSize: `${smallTextFontSize}px`,
                                            color: primaryColor,
                                            marginBottom: `${gap * 0.75}px`,
                                            margin: `0 0 ${gap * 0.75}px 0`,
                                        }}
                                    >
                                        {paymentRedirectSubtext}
                                    </p>
                                    <button
                                        onClick={() =>
                                            window.open(
                                                bookingSuccess.paymentUrl,
                                                "_blank"
                                            )
                                        }
                                        style={{
                                            width: "100%",
                                            backgroundColor: primaryColor,
                                            color: "white",
                                            padding: `${buttonPadding}px`,
                                            borderRadius: `${borderRadius * 0.75}px`,
                                            border: "none",
                                            cursor: "pointer",
                                            transition: `all ${animationSpeed}ms ease`,
                                            fontWeight: "600",
                                            fontSize: `${buttonFontSize}px`,
                                            fontFamily: fontFamily,
                                        }}
                                    >
                                        🚀 {paymentButtonText}
                                    </button>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        padding: `${gap}px`,
                                        backgroundColor: "#fef3c7",
                                        borderRadius: `${borderRadius * 0.75}px`,
                                        border: "1px solid #f59e0b",
                                    }}
                                >
                                    <p
                                        style={{
                                            color: "#92400e",
                                            fontWeight: "600",
                                            marginBottom: `${gap * 0.5}px`,
                                            margin: `0 0 ${gap * 0.5}px 0`,
                                        }}
                                    >
                                        ⚠️ {manualPaymentTitle}
                                    </p>
                                    <p
                                        style={{
                                            fontSize: `${smallTextFontSize}px`,
                                            color: "#92400e",
                                            margin: "0",
                                        }}
                                    >
                                        {manualPaymentText}
                                        <br />
                                        Contactez-nous pour finaliser le
                                        paiement.
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => {
                                setBookingSuccess(null)
                                window.location.reload()
                            }}
                            style={{
                                width: "100%",
                                backgroundColor: "#6b7280",
                                color: "white",
                                padding: `${buttonPadding}px`,
                                borderRadius: `${borderRadius * 0.75}px`,
                                border: "none",
                                cursor: "pointer",
                                transition: `all ${animationSpeed}ms ease`,
                                fontWeight: "600",
                                fontSize: `${buttonFontSize}px`,
                                fontFamily: fontFamily,
                            }}
                        >
                            {closeButtonText}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

// Contrôles Framer organisés en groupes
addPropertyControls(BooklaCalendarFramerFinal, {
    // === GROUPE 1: CONFIGURATION BOOKLA ===
    organizationId: {
        type: ControlType.String,
        title: "🔧 Organization ID",
        defaultValue: "18566a74-b1ab-4345-948a-517f2ca10f09",
        description: "ID de votre organisation Bookla",
    },
    apiKey: {
        type: ControlType.String,
        title: "🔑 API Key",
        defaultValue: "teVkXn9d17cKZknCZopXDsEPz8SHs2Mf3E7r",
        description: "Clé API Bookla",
    },
    baseUrl: {
        type: ControlType.String,
        title: "🌐 Base URL",
        defaultValue: "https://us.bookla.com",
        description: "URL de base de l'API Bookla",
    },
    resourceId: {
        type: ControlType.String,
        title: "📦 Resource ID",
        defaultValue: "8f653843-ae64-4d1a-9701-3a1ab12d133c",
        description: "ID de la ressource Bookla",
    },

    // === GROUPE 2: SERVICES ===
    service1Name: {
        type: ControlType.String,
        title: "🚢 Service 1 - Nom",
        defaultValue: "Service Journée",
    },
    service1Price: {
        type: ControlType.Number,
        title: "💰 Service 1 - Prix",
        defaultValue: 300,
        min: 0,
        max: 10000,
        step: 10,
    },
    service1ApaPrice: {
        type: ControlType.Number,
        title: "⛽ Service 1 - APA",
        defaultValue: 100,
        min: 0,
        max: 5000,
        step: 10,
    },
    service1Id: {
        type: ControlType.String,
        title: "🆔 Service 1 - ID Bookla",
        defaultValue: "e7c09d8e-e012-4b82-8b31-d584fa4be8ae",
    },

    service2Name: {
        type: ControlType.String,
        title: "🌅 Service 2 - Nom",
        defaultValue: "Service Sunset",
    },
    service2Price: {
        type: ControlType.Number,
        title: "💰 Service 2 - Prix",
        defaultValue: 200,
        min: 0,
        max: 10000,
        step: 10,
    },
    service2ApaPrice: {
        type: ControlType.Number,
        title: "⛽ Service 2 - APA",
        defaultValue: 50,
        min: 0,
        max: 5000,
        step: 10,
    },
    service2Id: {
        type: ControlType.String,
        title: "🆔 Service 2 - ID Bookla",
        defaultValue: "1b994905-1980-4c7d-813a-66fcb8d88f92",
    },

    service3Name: {
        type: ControlType.String,
        title: "🎯 Service 3 - Nom",
        defaultValue: "Service Mix",
    },
    service3Price: {
        type: ControlType.Number,
        title: "💰 Service 3 - Prix",
        defaultValue: 350,
        min: 0,
        max: 10000,
        step: 10,
    },
    service3ApaPrice: {
        type: ControlType.Number,
        title: "⛽ Service 3 - APA",
        defaultValue: 120,
        min: 0,
        max: 5000,
        step: 10,
    },
    service3Id: {
        type: ControlType.String,
        title: "🆔 Service 3 - ID Bookla",
        defaultValue: "7c3ca43d-37b4-483e-b3f6-39e8aed4afe9",
    },

    // === GROUPE 3: URLS ===
    successUrl: {
        type: ControlType.String,
        title: "✅ URL Succès",
        defaultValue: "https://loupinedou-yacht.fr/confirmation-page",
    },
    cancelUrl: {
        type: ControlType.String,
        title: "❌ URL Annulation",
        defaultValue: "https://loupinedou-yacht.fr/error-page",
    },
    termsUrl: {
        type: ControlType.String,
        title: "📄 URL Conditions",
        defaultValue: "https://loupinedou-yacht.fr/conditions",
    },

    // === GROUPE 4: TEXTES INTERFACE ===
    title: {
        type: ControlType.String,
        title: "📝 Titre principal",
        defaultValue: "Réservation de Bateau",
    },
    subtitle: {
        type: ControlType.String,
        title: "📝 Sous-titre",
        defaultValue:
            "Sélectionnez une date disponible pour réserver votre service",
    },
    selectServiceLabel: {
        type: ControlType.String,
        title: "📝 Label sélection service",
        defaultValue: "Sélectionnez votre service :",
    },
    priceLabel: {
        type: ControlType.String,
        title: "📝 Label prix",
        defaultValue: "Prix:",
    },
    apaLabel: {
        type: ControlType.String,
        title: "📝 Label APA",
        defaultValue: "d'APA",
    },
    totalLabel: {
        type: ControlType.String,
        title: "📝 Label total",
        defaultValue: "Total:",
    },

    // === GROUPE 5: COULEURS ===
    primaryColor: {
        type: ControlType.Color,
        title: "🎨 Couleur principale",
        defaultValue: "#16a34a",
    },
    secondaryColor: {
        type: ControlType.Color,
        title: "🎨 Couleur secondaire",
        defaultValue: "#f1f5f9",
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "🎨 Couleur de fond",
        defaultValue: "#ffffff",
    },
    textColor: {
        type: ControlType.Color,
        title: "🎨 Couleur du texte",
        defaultValue: "#374151",
    },
    successColor: {
        type: ControlType.Color,
        title: "🎨 Couleur succès",
        defaultValue: "#16a34a",
    },
    errorColor: {
        type: ControlType.Color,
        title: "🎨 Couleur erreur",
        defaultValue: "#dc2626",
    },

    // === GROUPE 6: TYPOGRAPHIE ===
    fontFamily: {
        type: ControlType.String,
        title: "🔤 Police",
        defaultValue: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    titleFontSize: {
        type: ControlType.Number,
        title: "📏 Taille titre",
        defaultValue: 28,
        min: 16,
        max: 48,
        step: 2,
    },
    textFontSize: {
        type: ControlType.Number,
        title: "📏 Taille texte",
        defaultValue: 16,
        min: 12,
        max: 24,
        step: 1,
    },
    buttonFontSize: {
        type: ControlType.Number,
        title: "📏 Taille boutons",
        defaultValue: 16,
        min: 12,
        max: 24,
        step: 1,
    },

    // === GROUPE 7: DIMENSIONS ===
    width: {
        type: ControlType.Number,
        title: "📐 Largeur",
        defaultValue: 800,
        min: 400,
        max: 1200,
        step: 50,
    },
    height: {
        type: ControlType.Number,
        title: "📐 Hauteur",
        defaultValue: 900,
        min: 600,
        max: 1400,
        step: 50,
    },
    borderRadius: {
        type: ControlType.Number,
        title: "📐 Rayon bordures",
        defaultValue: 12,
        min: 0,
        max: 30,
        step: 2,
    },
    padding: {
        type: ControlType.Number,
        title: "📐 Espacement interne",
        defaultValue: 32,
        min: 16,
        max: 64,
        step: 4,
    },

    // === GROUPE 8: AFFICHAGE ===
    showBadge: {
        type: ControlType.Boolean,
        title: "🏷️ Afficher badge",
        defaultValue: true,
    },
    badgeText: {
        type: ControlType.String,
        title: "🏷️ Texte badge",
        defaultValue: "Frontend-Only",
    },
    badgeColor: {
        type: ControlType.Color,
        title: "🏷️ Couleur badge",
        defaultValue: "#8b5cf6",
    },
})

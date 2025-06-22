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

export default function BooklaCalendarFramerDynamic(props) {
    const {
        // Configuration Bookla
        booklaConfig = {
            organizationId: "18566a74-b1ab-4345-948a-517f2ca10f09",
            apiKey: "teVkXn9d17cKZknCZopXDsEPz8SHs2Mf3E7r",
            baseUrl: "https://us.bookla.com",
            resourceId: "8f653843-ae64-4d1a-9701-3a1ab12d133c",
        },

        // Configuration des Services Dynamiques
        servicesConfig = {
            numberOfServices: 3,
            service1: {
                enabled: true,
                name: "Service Journée",
                price: 300,
                apaPrice: 100,
                booklaId: "e7c09d8e-e012-4b82-8b31-d584fa4be8ae",
                description: "Service complet pour une journée en mer",
            },
            service2: {
                enabled: true,
                name: "Service Sunset",
                price: 200,
                apaPrice: 50,
                booklaId: "1b994905-1980-4c7d-813a-66fcb8d88f92",
                description: "Escapade romantique au coucher du soleil",
            },
            service3: {
                enabled: true,
                name: "Service Mix",
                price: 350,
                apaPrice: 120,
                booklaId: "7c3ca43d-37b4-483e-b3f6-39e8aed4afe9",
                description: "Expérience mixte personnalisée",
            },
            service4: {
                enabled: false,
                name: "Service Premium",
                price: 500,
                apaPrice: 200,
                booklaId: "",
                description: "Service premium avec extras",
            },
            service5: {
                enabled: false,
                name: "Service Express",
                price: 150,
                apaPrice: 30,
                booklaId: "",
                description: "Service rapide 2h",
            },
        },

        // Configuration du Formulaire
        formConfig = {
            fields: {
                firstName: {
                    enabled: true,
                    required: true,
                    label: "Prénom",
                    placeholder: "Votre prénom",
                },
                lastName: {
                    enabled: true,
                    required: true,
                    label: "Nom",
                    placeholder: "Votre nom",
                },
                email: {
                    enabled: true,
                    required: true,
                    label: "Email",
                    placeholder: "votre@email.com",
                },
                phone: {
                    enabled: true,
                    required: true,
                    label: "Téléphone",
                    placeholder: "+33 6 12 34 56 78",
                },
                company: {
                    enabled: false,
                    required: false,
                    label: "Entreprise",
                    placeholder: "Nom de votre entreprise",
                },
                address: {
                    enabled: false,
                    required: false,
                    label: "Adresse",
                    placeholder: "Votre adresse",
                },
                specialRequests: {
                    enabled: false,
                    required: false,
                    label: "Demandes spéciales",
                    placeholder: "Vos demandes particulières...",
                },
                numberOfPeople: {
                    enabled: false,
                    required: false,
                    label: "Nombre de personnes",
                    placeholder: "Ex: 4",
                },
            },
            customFields: {
                field1: {
                    enabled: false,
                    required: false,
                    label: "Champ personnalisé 1",
                    placeholder: "Valeur personnalisée",
                    type: "text",
                },
                field2: {
                    enabled: false,
                    required: false,
                    label: "Champ personnalisé 2",
                    placeholder: "Autre valeur",
                    type: "text",
                },
            },
        },

        // URLs
        urlsConfig = {
            successUrl: "https://loupinedou-yacht.fr/confirmation-page",
            cancelUrl: "https://loupinedou-yacht.fr/error-page",
            termsUrl: "https://loupinedou-yacht.fr/conditions",
        },

        // Textes Interface
        textsInterface = {
            title: "Réservation de Bateau",
            subtitle:
                "Sélectionnez une date disponible pour réserver votre service",
            selectServiceLabel: "Sélectionnez votre service :",
            priceLabel: "Prix:",
            apaLabel: "d'APA",
            totalLabel: "Total:",
            todayButtonText: "Aujourd'hui",
            availableText: "Disponible",
            loadingText: "Chargement des disponibilités...",
            errorRetryText: "Réessayer",
        },

        // Textes Formulaire
        textsForm = {
            chooseTimeTitle: "Choisissez un horaire",
            bookingFormTitle: "Réservation",
            summaryTitle: "Récapitulatif",
            termsText: "J'accepte les",
            termsLinkText: "conditions générales",
            backButtonText: "Retour",
            bookButtonText: "Réserver",
            cancelButtonText: "Annuler",
            bookingLoadingText: "Création en cours...",
            requiredFieldsText: "Les champs marqués d'un * sont obligatoires",
        },

        // Textes Succès
        textsSuccess = {
            successTitle: "Réservation créée !",
            successBookingIdLabel: "ID de réservation:",
            successStatusLabel: "Statut:",
            successMethodLabel: "Méthode de paiement:",
            successServiceLabel: "Service:",
            successDateLabel: "Date:",
            successTimeLabel: "Horaire:",
            successTotalLabel: "Total:",
            paymentRedirectText: "Redirection vers paiement en cours...",
            paymentRedirectSubtext:
                "Vous serez redirigé automatiquement dans 3 secondes.",
            paymentButtonText: "Procéder au paiement maintenant",
            manualPaymentTitle: "Paiement automatique indisponible",
            manualPaymentText: "Votre réservation est créée et sécurisée.",
            closeButtonText: "Fermer et actualiser",
        },

        // Couleurs
        colors = {
            primaryColor: "#16a34a",
            secondaryColor: "#f1f5f9",
            backgroundColor: "#ffffff",
            textColor: "#374151",
            borderColor: "#e2e8f0",
            successColor: "#16a34a",
            errorColor: "#dc2626",
            availableDateColor: "#dcfce7",
            availableDateBorderColor: "#bbf7d0",
            currentDayColor: "#16a34a",
            currentDayBackgroundColor: "#16a34a20",
        },

        // Typographie
        typography = {
            fontFamily:
                "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            titleFontSize: 28,
            subtitleFontSize: 18,
            labelFontSize: 18,
            textFontSize: 16,
            smallTextFontSize: 14,
            buttonFontSize: 16,
        },

        // Dimensions
        dimensions = {
            borderRadius: 12,
            padding: 32,
            gap: 16,
            buttonPadding: 12,
            inputPadding: 12,
            width: 800,
            height: 900,
        },

        // Style
        style = {
            showBadge: true,
            badgeText: "Frontend-Only",
            badgeColor: "#8b5cf6",
            animationSpeed: 300,
        },
    } = props

    const today = new Date()
    const [currentYear, setCurrentYear] = React.useState(today.getFullYear())
    const [currentMonth, setCurrentMonth] = React.useState(today.getMonth())
    const [availableSlots, setAvailableSlots] = React.useState({})
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState(null)

    // États pour la réservation
    const [selectedDate, setSelectedDate] = React.useState(null)
    const [selectedTimeSlot, setSelectedTimeSlot] = React.useState(null)
    const [selectedServiceId, setSelectedServiceId] = React.useState("")
    const [showTimeSelection, setShowTimeSelection] = React.useState(false)
    const [showBookingForm, setShowBookingForm] = React.useState(false)
    const [isBooking, setIsBooking] = React.useState(false)
    const [bookingSuccess, setBookingSuccess] = React.useState(null)

    // État dynamique du formulaire
    const [customerInfo, setCustomerInfo] = React.useState({})

    // Génération dynamique des services activés
    const getEnabledServices = React.useMemo(() => {
        const services = []
        const serviceKeys = [
            "service1",
            "service2",
            "service3",
            "service4",
            "service5",
        ]

        for (let i = 0; i < Math.min(servicesConfig.numberOfServices, 5); i++) {
            const serviceKey = serviceKeys[i]
            const serviceData = servicesConfig[serviceKey]

            if (serviceData && serviceData.enabled && serviceData.booklaId) {
                services.push({
                    id: serviceData.booklaId,
                    name: serviceData.name,
                    basePrice: serviceData.price,
                    apaPrice: serviceData.apaPrice,
                    description: serviceData.description,
                })
            }
        }

        return services
    }, [servicesConfig])

    // Initialiser le service sélectionné
    React.useEffect(() => {
        if (getEnabledServices.length > 0 && !selectedServiceId) {
            setSelectedServiceId(getEnabledServices[0].id)
        }
    }, [getEnabledServices, selectedServiceId])

    // Génération dynamique des champs du formulaire
    const getFormFields = React.useMemo(() => {
        const fields = []

        // Champs standards
        Object.entries(formConfig.fields).forEach(([key, field]) => {
            if (field.enabled) {
                fields.push({
                    key,
                    ...field,
                    type:
                        key === "email"
                            ? "email"
                            : key === "phone"
                              ? "tel"
                              : "text",
                })
            }
        })

        // Champs personnalisés
        Object.entries(formConfig.customFields).forEach(([key, field]) => {
            if (field.enabled) {
                fields.push({
                    key,
                    ...field,
                })
            }
        })

        return fields
    }, [formConfig])

    // Initialiser customerInfo avec les champs dynamiques
    React.useEffect(() => {
        const initialInfo = { termsAccepted: false }
        getFormFields.forEach((field) => {
            if (!customerInfo.hasOwnProperty(field.key)) {
                initialInfo[field.key] = ""
            }
        })

        if (Object.keys(initialInfo).length > 1) {
            setCustomerInfo((prev) => ({ ...prev, ...initialInfo }))
        }
    }, [getFormFields])

    // Hook pour récupérer les disponibilités
    React.useEffect(() => {
        if (!selectedServiceId) return

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
                    `📅 Récupération disponibilités pour ${selectedServiceId}: ${fromDate} → ${toDate}`
                )

                const apiUrl = `${booklaConfig.baseUrl}/api/v1/companies/${booklaConfig.organizationId}/services/${selectedServiceId}/times`

                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "X-API-Key": booklaConfig.apiKey,
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
    }, [currentYear, currentMonth, selectedServiceId, booklaConfig])

    // Validation du formulaire dynamique
    const validateForm = () => {
        const requiredFields = getFormFields.filter((field) => field.required)
        for (const field of requiredFields) {
            if (
                !customerInfo[field.key] ||
                customerInfo[field.key].trim() === ""
            ) {
                alert(`Le champ "${field.label}" est obligatoire`)
                return false
            }
        }

        if (!customerInfo.termsAccepted) {
            alert("Vous devez accepter les conditions générales")
            return false
        }

        return true
    }

    // Workflow de réservation Frontend-Only
    const handleBookingFrontendOnly = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        if (!selectedTimeSlot) {
            alert("Aucun créneau sélectionné")
            return
        }

        setIsBooking(true)

        try {
            const service = getEnabledServices.find(
                (s) => s.id === selectedServiceId
            )
            if (!service) throw new Error("Service non trouvé")

            console.log("🚀 === WORKFLOW FRONTEND-ONLY DYNAMIQUE ===")

            // Préparer les données client avec les champs dynamiques
            const clientData = {}
            getFormFields.forEach((field) => {
                if (customerInfo[field.key]) {
                    clientData[field.key] = customerInfo[field.key]
                }
            })

            // ÉTAPE 1: Créer réservation
            const bookingPayload = {
                companyID: booklaConfig.organizationId,
                serviceID: selectedServiceId,
                resourceID:
                    selectedTimeSlot.resourceId || booklaConfig.resourceId,
                startTime: selectedTimeSlot.startTime,
                endTime: selectedTimeSlot.endTime,
                client: clientData,
                spots: 1,
                status: "pending",
                requirePayment: true,
                termsAccepted: customerInfo.termsAccepted,
                metadata: {
                    source: "framer_dynamic",
                    payment_method: "bookla_integrated",
                    domain: window.location.hostname,
                    total_amount: (
                        service.basePrice + service.apaPrice
                    ).toString(),
                    service_name: service.name,
                    created_at: new Date().toISOString(),
                    form_fields: JSON.stringify(clientData),
                },
            }

            const bookingResponse = await fetch(
                `${booklaConfig.baseUrl}/api/v1/companies/${booklaConfig.organizationId}/bookings`,
                {
                    method: "POST",
                    headers: {
                        "X-API-Key": booklaConfig.apiKey,
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
                description: `Réservation ${service.name} - Framer Dynamique`,
                successUrl: `${urlsConfig.successUrl}?booking=${bookingId}&payment=success&source=framer_dynamic`,
                cancelUrl: `${urlsConfig.cancelUrl}?booking=${bookingId}&payment=cancelled&source=framer_dynamic`,
                metadata: {
                    bookingId: bookingId,
                    source: "framer_dynamic",
                    serviceName: service.name,
                    customerName:
                        `${clientData.firstName || ""} ${clientData.lastName || ""}`.trim(),
                    customerEmail: clientData.email || "",
                    totalAmount: (
                        service.basePrice + service.apaPrice
                    ).toString(),
                },
            }

            // Essayer plusieurs endpoints Bookla
            const paymentEndpoints = [
                `${booklaConfig.baseUrl}/api/v1/companies/${booklaConfig.organizationId}/bookings/${bookingId}/payment`,
                `${booklaConfig.baseUrl}/api/v1/companies/${booklaConfig.organizationId}/bookings/${bookingId}/checkout`,
                `${booklaConfig.baseUrl}/api/v1/companies/${booklaConfig.organizationId}/payments`,
            ]

            let paymentSuccess = false
            let paymentUrl = null

            for (const endpoint of paymentEndpoints) {
                try {
                    console.log(`🎯 Tentative paiement: ${endpoint}`)

                    const paymentResponse = await fetch(endpoint, {
                        method: "POST",
                        headers: {
                            "X-API-Key": booklaConfig.apiKey,
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

            // Réinitialiser avec les champs dynamiques
            const resetInfo = { termsAccepted: false }
            getFormFields.forEach((field) => {
                resetInfo[field.key] = ""
            })
            setCustomerInfo(resetInfo)
        } catch (error) {
            console.error("❌ ERREUR CRITIQUE:", error)
            alert(`Erreur: ${error.message}`)
        } finally {
            setIsBooking(false)
        }
    }

    // Mise à jour des champs du formulaire
    const updateFormField = (key, value) => {
        setCustomerInfo((prev) => ({
            ...prev,
            [key]: value,
        }))
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
                    ? colors.availableDateColor
                    : colors.secondaryColor,
                borderRadius: `${dimensions.borderRadius * 0.75}px`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                cursor: isDateAvailable && !isPastDate ? "pointer" : "default",
                border: `2px solid ${isDateAvailable ? colors.availableDateBorderColor : "transparent"}`,
                transition: `all ${style.animationSpeed}ms ease`,
                opacity: isPastDate ? 0.3 : 1,
                fontFamily: typography.fontFamily,
                fontSize: `${typography.textFontSize}px`,
                color: colors.textColor,
            }

            if (isCurrentDay) {
                dayStyle.border = `2px solid ${colors.currentDayColor}`
                dayStyle.backgroundColor = colors.currentDayBackgroundColor
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
                                backgroundColor: colors.successColor,
                                borderRadius: "50%",
                                marginTop: "4px",
                            }}
                        ></div>
                    )}
                    {isDateAvailable && daySlots.length > 1 && (
                        <span
                            style={{
                                fontSize: `${typography.smallTextFontSize}px`,
                                color: colors.successColor,
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
        width: dimensions.width,
        height: dimensions.height,
        maxWidth: "100%",
        backgroundColor: colors.backgroundColor,
        borderRadius: `${dimensions.borderRadius}px`,
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
        padding: `${dimensions.padding}px`,
        fontFamily: typography.fontFamily,
        fontSize: `${typography.textFontSize}px`,
        color: colors.textColor,
        overflow: "auto",
        position: "relative",
    }

    const badgeStyle = style.showBadge
        ? {
              position: "absolute",
              top: `${dimensions.gap}px`,
              right: `${dimensions.gap}px`,
              backgroundColor: style.badgeColor,
              color: "white",
              padding: `${dimensions.gap * 0.5}px ${dimensions.gap * 0.75}px`,
              borderRadius: `${dimensions.borderRadius * 0.5}px`,
              fontSize: `${typography.smallTextFontSize}px`,
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              zIndex: 10,
          }
        : { display: "none" }

    // Vérification des services disponibles
    if (getEnabledServices.length === 0) {
        return (
            <div style={containerStyle}>
                <div style={{ textAlign: "center", padding: "80px 20px" }}>
                    <div style={{ fontSize: "60px", marginBottom: "16px" }}>
                        ⚠️
                    </div>
                    <h3
                        style={{
                            color: colors.errorColor,
                            marginBottom: "8px",
                        }}
                    >
                        Aucun service configuré
                    </h3>
                    <p>
                        Veuillez activer au moins un service dans la
                        configuration.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div style={containerStyle}>
            <style>{`
                @keyframes spin-dynamic {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>

            {/* Badge Frontend-Only */}
            <div style={badgeStyle}>{style.badgeText}</div>

            {/* En-tête */}
            <div
                style={{
                    textAlign: "center",
                    marginBottom: `${dimensions.gap * 2}px`,
                }}
            >
                <h1
                    style={{
                        fontSize: `${typography.titleFontSize}px`,
                        fontWeight: "700",
                        marginBottom: `${dimensions.gap * 0.5}px`,
                        lineHeight: "1.3",
                        margin: `0 0 ${dimensions.gap * 0.5}px 0`,
                    }}
                >
                    {textsInterface.title}
                </h1>
                <p
                    style={{
                        fontSize: `${typography.subtitleFontSize}px`,
                        color: `${colors.textColor}99`,
                        marginBottom: "0",
                        margin: "0",
                    }}
                >
                    {textsInterface.subtitle}
                </p>
            </div>

            {/* Sélection du service */}
            <div
                style={{
                    marginBottom: `${dimensions.gap * 2}px`,
                    textAlign: "center",
                }}
            >
                <label
                    style={{
                        display: "block",
                        marginBottom: `${dimensions.gap}px`,
                        fontWeight: "600",
                        fontSize: `${typography.labelFontSize}px`,
                    }}
                >
                    {textsInterface.selectServiceLabel}
                </label>
                <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    style={{
                        padding: `${dimensions.inputPadding}px ${dimensions.inputPadding * 1.25}px`,
                        borderRadius: `${dimensions.borderRadius * 0.75}px`,
                        border: `2px solid ${colors.borderColor}`,
                        backgroundColor: colors.backgroundColor,
                        color: colors.textColor,
                        fontSize: `${typography.textFontSize}px`,
                        fontFamily: typography.fontFamily,
                        width: "100%",
                        maxWidth: "400px",
                        cursor: "pointer",
                        outline: "none",
                    }}
                    disabled={loading}
                >
                    {getEnabledServices.map((service) => (
                        <option key={service.id} value={service.id}>
                            {service.name}
                        </option>
                    ))}
                </select>

                {getEnabledServices.find((s) => s.id === selectedServiceId) && (
                    <div
                        style={{
                            marginTop: `${dimensions.gap}px`,
                            padding: `${dimensions.gap}px`,
                            backgroundColor: colors.secondaryColor,
                            borderRadius: `${dimensions.borderRadius * 0.75}px`,
                            textAlign: "center",
                            maxWidth: "400px",
                            margin: `${dimensions.gap}px auto 0`,
                        }}
                    >
                        <div
                            style={{
                                marginBottom: `${dimensions.gap * 0.5}px`,
                            }}
                        >
                            <span
                                style={{
                                    fontStyle: "italic",
                                    fontSize: `${typography.smallTextFontSize}px`,
                                    color: `${colors.textColor}99`,
                                }}
                            >
                                {
                                    getEnabledServices.find(
                                        (s) => s.id === selectedServiceId
                                    )?.description
                                }
                            </span>
                        </div>
                        <div>
                            <span>{textsInterface.priceLabel} </span>
                            <span style={{ fontWeight: "600" }}>
                                {
                                    getEnabledServices.find(
                                        (s) => s.id === selectedServiceId
                                    ).basePrice
                                }
                                € +{" "}
                                {
                                    getEnabledServices.find(
                                        (s) => s.id === selectedServiceId
                                    ).apaPrice
                                }
                                € {textsInterface.apaLabel}
                            </span>
                        </div>
                        <div
                            style={{
                                fontSize: `${typography.titleFontSize * 0.9}px`,
                                fontWeight: "700",
                                color: colors.primaryColor,
                                marginTop: `${dimensions.gap * 0.5}px`,
                            }}
                        >
                            {textsInterface.totalLabel}{" "}
                            {getEnabledServices.find(
                                (s) => s.id === selectedServiceId
                            ).basePrice +
                                getEnabledServices.find(
                                    (s) => s.id === selectedServiceId
                                ).apaPrice}
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
                    marginBottom: `${dimensions.gap * 2}px`,
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
                        backgroundColor: colors.secondaryColor,
                        border: "none",
                        borderRadius: `${dimensions.borderRadius * 0.75}px`,
                        fontSize: `${typography.buttonFontSize * 1.5}px`,
                        fontWeight: "bold",
                        cursor: "pointer",
                        width: "48px",
                        height: "48px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: colors.textColor,
                        transition: `all ${style.animationSpeed}ms ease`,
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
                        gap: `${dimensions.gap}px`,
                    }}
                >
                    <h2
                        style={{
                            fontSize: `${typography.titleFontSize * 0.9}px`,
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
                            backgroundColor: colors.primaryColor,
                            color: "white",
                            padding: `${dimensions.buttonPadding * 0.75}px ${dimensions.buttonPadding * 1.25}px`,
                            borderRadius: `${dimensions.borderRadius * 0.75}px`,
                            fontWeight: "600",
                            cursor: "pointer",
                            border: "none",
                            transition: `all ${style.animationSpeed}ms ease`,
                            fontSize: `${typography.buttonFontSize}px`,
                            fontFamily: typography.fontFamily,
                        }}
                        disabled={loading}
                    >
                        {textsInterface.todayButtonText}
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
                        backgroundColor: colors.secondaryColor,
                        border: "none",
                        borderRadius: `${dimensions.borderRadius * 0.75}px`,
                        fontSize: `${typography.buttonFontSize * 1.5}px`,
                        fontWeight: "bold",
                        cursor: "pointer",
                        width: "48px",
                        height: "48px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: colors.textColor,
                        transition: `all ${style.animationSpeed}ms ease`,
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
                    gap: `${dimensions.gap * 0.5}px`,
                    marginBottom: `${dimensions.gap}px`,
                }}
            >
                {WEEKDAYS.map((weekday) => (
                    <div
                        key={weekday}
                        style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            padding: `${dimensions.gap * 0.5}px 0`,
                            fontSize: `${typography.smallTextFontSize}px`,
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
                    gap: `${dimensions.gap * 0.5}px`,
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
                            gap: `${dimensions.gap}px`,
                        }}
                    >
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                border: `4px solid ${colors.secondaryColor}`,
                                borderTop: `4px solid ${colors.primaryColor}`,
                                borderRadius: "50%",
                                animation: "spin-dynamic 1s linear infinite",
                            }}
                        ></div>
                        <p
                            style={{
                                fontSize: `${typography.textFontSize}px`,
                                fontWeight: "500",
                                margin: "0",
                            }}
                        >
                            {textsInterface.loadingText}
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
                            gap: `${dimensions.gap}px`,
                            textAlign: "center",
                        }}
                    >
                        <div style={{ fontSize: "60px" }}>⚠️</div>
                        <p
                            style={{
                                color: colors.errorColor,
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
                                backgroundColor: colors.primaryColor,
                                color: "white",
                                padding: `${dimensions.buttonPadding}px ${dimensions.buttonPadding * 2}px`,
                                borderRadius: `${dimensions.borderRadius * 0.75}px`,
                                fontWeight: "600",
                                cursor: "pointer",
                                border: "none",
                                transition: `all ${style.animationSpeed}ms ease`,
                                fontSize: `${typography.buttonFontSize}px`,
                                fontFamily: typography.fontFamily,
                            }}
                        >
                            {textsInterface.errorRetryText}
                        </button>
                    </div>
                ) : (
                    generateCalendarDays()
                )}
            </div>

            {/* Légende */}
            <div
                style={{
                    marginTop: `${dimensions.gap * 2}px`,
                    paddingTop: `${dimensions.gap * 1.5}px`,
                    borderTop: `2px solid ${colors.borderColor}`,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: `${dimensions.gap * 2}px`,
                        marginBottom: `${dimensions.gap}px`,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: `${dimensions.gap * 0.75}px`,
                        }}
                    >
                        <div
                            style={{
                                width: "12px",
                                height: "12px",
                                backgroundColor: colors.successColor,
                                borderRadius: "50%",
                            }}
                        ></div>
                        <span>{textsInterface.availableText}</span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: `${dimensions.gap * 0.75}px`,
                        }}
                    >
                        <div
                            style={{
                                width: "12px",
                                height: "12px",
                                backgroundColor: colors.currentDayColor,
                                borderRadius: "50%",
                            }}
                        ></div>
                        <span>{textsInterface.todayButtonText}</span>
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
                                    margin: `0 0 ${dimensions.gap}px 0`,
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
                                    getEnabledServices.find(
                                        (s) => s.id === selectedServiceId
                                    )?.name
                                }
                            </p>
                            <div
                                style={{
                                    padding: `${dimensions.gap}px`,
                                    backgroundColor: `${style.badgeColor}20`,
                                    borderRadius: `${dimensions.borderRadius * 0.75}px`,
                                    border: `1px solid ${style.badgeColor}50`,
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: `${typography.smallTextFontSize}px`,
                                        color: style.badgeColor,
                                        fontWeight: "600",
                                        margin: "0",
                                    }}
                                >
                                    🔧 <strong>SERVICES DYNAMIQUES:</strong>{" "}
                                    {getEnabledServices.length} service
                                    {getEnabledServices.length > 1 ? "s" : ""}{" "}
                                    activé
                                    {getEnabledServices.length > 1 ? "s" : ""} •
                                    Formulaire: {getFormFields.length} champ
                                    {getFormFields.length > 1 ? "s" : ""}
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
                        padding: `${dimensions.gap}px`,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: colors.backgroundColor,
                            borderRadius: `${dimensions.borderRadius}px`,
                            padding: `${dimensions.padding}px`,
                            width: "100%",
                            maxWidth: "400px",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
                        }}
                    >
                        <h3
                            style={{
                                fontSize: `${typography.titleFontSize * 0.8}px`,
                                fontWeight: "700",
                                textAlign: "center",
                                marginBottom: `${dimensions.gap * 0.5}px`,
                                margin: `0 0 ${dimensions.gap * 0.5}px 0`,
                            }}
                        >
                            {textsForm.chooseTimeTitle}
                        </h3>
                        <p
                            style={{
                                textAlign: "center",
                                marginBottom: `${dimensions.gap * 1.5}px`,
                                color: `${colors.textColor}99`,
                                margin: `0 0 ${dimensions.gap * 1.5}px 0`,
                            }}
                        >
                            Date: {selectedDate}
                        </p>

                        <div
                            style={{
                                marginBottom: `${dimensions.gap * 1.5}px`,
                            }}
                        >
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
                                            padding: `${dimensions.buttonPadding}px`,
                                            border: `2px solid ${colors.borderColor}`,
                                            borderRadius: `${dimensions.borderRadius * 0.75}px`,
                                            backgroundColor:
                                                colors.backgroundColor,
                                            color: colors.textColor,
                                            cursor: "pointer",
                                            transition: `all ${style.animationSpeed}ms ease`,
                                            textAlign: "left",
                                            marginBottom: `${dimensions.gap * 0.75}px`,
                                            fontSize: `${typography.textFontSize}px`,
                                            fontFamily: typography.fontFamily,
                                        }}
                                    >
                                        <div style={{ fontWeight: "600" }}>
                                            {formatTimeString(slot.startTime)}
                                            {slot.endTime &&
                                                ` - ${formatTimeString(slot.endTime)}`}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: `${typography.smallTextFontSize}px`,
                                                color: `${colors.textColor}99`,
                                            }}
                                        >
                                            {
                                                getEnabledServices.find(
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
                                padding: `${dimensions.buttonPadding}px`,
                                backgroundColor: colors.secondaryColor,
                                color: colors.textColor,
                                borderRadius: `${dimensions.borderRadius * 0.75}px`,
                                fontWeight: "600",
                                border: "none",
                                cursor: "pointer",
                                transition: `all ${style.animationSpeed}ms ease`,
                                fontSize: `${typography.buttonFontSize}px`,
                                fontFamily: typography.fontFamily,
                            }}
                        >
                            {textsForm.cancelButtonText}
                        </button>
                    </div>
                </div>
            )}

            {/* Modal formulaire de réservation DYNAMIQUE */}
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
                        padding: `${dimensions.gap}px`,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: colors.backgroundColor,
                            borderRadius: `${dimensions.borderRadius}px`,
                            padding: `${dimensions.padding}px`,
                            width: "100%",
                            maxWidth: "500px",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
                        }}
                    >
                        <h3
                            style={{
                                fontSize: `${typography.titleFontSize * 0.8}px`,
                                fontWeight: "700",
                                textAlign: "center",
                                marginBottom: `${dimensions.gap * 0.5}px`,
                                margin: `0 0 ${dimensions.gap * 0.5}px 0`,
                            }}
                        >
                            {textsForm.bookingFormTitle} -{" "}
                            {
                                getEnabledServices.find(
                                    (s) => s.id === selectedServiceId
                                )?.name
                            }
                        </h3>
                        <p
                            style={{
                                textAlign: "center",
                                marginBottom: `${dimensions.gap * 0.5}px`,
                                color: `${colors.textColor}99`,
                                margin: `0 0 ${dimensions.gap * 0.5}px 0`,
                            }}
                        >
                            Date: {selectedDate}
                        </p>
                        <p
                            style={{
                                textAlign: "center",
                                marginBottom: `${dimensions.gap * 1.5}px`,
                                color: `${colors.textColor}99`,
                                margin: `0 0 ${dimensions.gap * 1.5}px 0`,
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
                                gap: `${dimensions.gap}px`,
                            }}
                        >
                            {/* Champs dynamiques du formulaire */}
                            {getFormFields.map((field) => (
                                <div
                                    key={field.key}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: `${dimensions.gap * 0.5}px`,
                                    }}
                                >
                                    <label
                                        style={{
                                            fontWeight: "600",
                                            fontSize: `${typography.labelFontSize}px`,
                                        }}
                                    >
                                        {field.label} {field.required && "*"}
                                    </label>
                                    {field.type === "textarea" ? (
                                        <textarea
                                            name={field.key}
                                            value={
                                                customerInfo[field.key] || ""
                                            }
                                            onChange={(e) =>
                                                updateFormField(
                                                    field.key,
                                                    e.target.value
                                                )
                                            }
                                            placeholder={field.placeholder}
                                            style={{
                                                padding: `${dimensions.inputPadding}px`,
                                                borderRadius: `${dimensions.borderRadius * 0.75}px`,
                                                border: `1px solid ${colors.borderColor}`,
                                                backgroundColor:
                                                    colors.backgroundColor,
                                                color: colors.textColor,
                                                fontSize: `${typography.textFontSize}px`,
                                                fontFamily:
                                                    typography.fontFamily,
                                                outline: "none",
                                                minHeight: "80px",
                                                resize: "vertical",
                                            }}
                                            required={field.required}
                                        />
                                    ) : (
                                        <input
                                            type={field.type}
                                            name={field.key}
                                            value={
                                                customerInfo[field.key] || ""
                                            }
                                            onChange={(e) =>
                                                updateFormField(
                                                    field.key,
                                                    e.target.value
                                                )
                                            }
                                            placeholder={field.placeholder}
                                            style={{
                                                padding: `${dimensions.inputPadding}px`,
                                                borderRadius: `${dimensions.borderRadius * 0.75}px`,
                                                border: `1px solid ${colors.borderColor}`,
                                                backgroundColor:
                                                    colors.backgroundColor,
                                                color: colors.textColor,
                                                fontSize: `${typography.textFontSize}px`,
                                                fontFamily:
                                                    typography.fontFamily,
                                                outline: "none",
                                            }}
                                            required={field.required}
                                        />
                                    )}
                                </div>
                            ))}

                            {getEnabledServices.find(
                                (s) => s.id === selectedServiceId
                            ) && (
                                <div
                                    style={{
                                        padding: `${dimensions.gap}px`,
                                        backgroundColor: colors.secondaryColor,
                                        borderRadius: `${dimensions.borderRadius * 0.75}px`,
                                        border: `1px solid ${colors.borderColor}`,
                                    }}
                                >
                                    <h4
                                        style={{
                                            fontWeight: "600",
                                            textAlign: "center",
                                            marginBottom: `${dimensions.gap * 0.75}px`,
                                            margin: `0 0 ${dimensions.gap * 0.75}px 0`,
                                            fontSize: `${typography.labelFontSize}px`,
                                        }}
                                    >
                                        {textsForm.summaryTitle}
                                    </h4>
                                    <div style={{ textAlign: "center" }}>
                                        <div
                                            style={{
                                                marginBottom: `${dimensions.gap * 0.5}px`,
                                                fontStyle: "italic",
                                                fontSize: `${typography.smallTextFontSize}px`,
                                            }}
                                        >
                                            {
                                                getEnabledServices.find(
                                                    (s) =>
                                                        s.id ===
                                                        selectedServiceId
                                                )?.description
                                            }
                                        </div>
                                        <div>
                                            <span>
                                                {textsInterface.priceLabel}{" "}
                                            </span>
                                            <span style={{ fontWeight: "600" }}>
                                                {
                                                    getEnabledServices.find(
                                                        (s) =>
                                                            s.id ===
                                                            selectedServiceId
                                                    ).basePrice
                                                }
                                                € +{" "}
                                                {
                                                    getEnabledServices.find(
                                                        (s) =>
                                                            s.id ===
                                                            selectedServiceId
                                                    ).apaPrice
                                                }
                                                € {textsInterface.apaLabel}
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                fontSize: `${typography.titleFontSize * 0.8}px`,
                                                fontWeight: "700",
                                                color: colors.primaryColor,
                                                marginTop: `${dimensions.gap * 0.5}px`,
                                            }}
                                        >
                                            {textsInterface.totalLabel}{" "}
                                            {getEnabledServices.find(
                                                (s) =>
                                                    s.id === selectedServiceId
                                            ).basePrice +
                                                getEnabledServices.find(
                                                    (s) =>
                                                        s.id ===
                                                        selectedServiceId
                                                ).apaPrice}
                                            €
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Note sur les champs obligatoires */}
                            {getFormFields.some((field) => field.required) && (
                                <div
                                    style={{
                                        padding: `${dimensions.gap * 0.75}px`,
                                        backgroundColor: `${colors.primaryColor}10`,
                                        borderRadius: `${dimensions.borderRadius * 0.5}px`,
                                        fontSize: `${typography.smallTextFontSize}px`,
                                        color: colors.primaryColor,
                                        textAlign: "center",
                                    }}
                                >
                                    {textsForm.requiredFieldsText}
                                </div>
                            )}

                            <div
                                style={{
                                    padding: `${dimensions.gap}px`,
                                    backgroundColor: colors.secondaryColor,
                                    borderRadius: `${dimensions.borderRadius * 0.75}px`,
                                    border: `1px solid ${colors.borderColor}`,
                                }}
                            >
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: `${dimensions.gap * 0.75}px`,
                                        cursor: "pointer",
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        name="termsAccepted"
                                        checked={
                                            customerInfo.termsAccepted || false
                                        }
                                        onChange={(e) =>
                                            updateFormField(
                                                "termsAccepted",
                                                e.target.checked
                                            )
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
                                            fontSize: `${typography.smallTextFontSize}px`,
                                        }}
                                    >
                                        {textsForm.termsText}{" "}
                                        <a
                                            href={urlsConfig.termsUrl}
                                            style={{
                                                color: colors.primaryColor,
                                                textDecoration: "underline",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {textsForm.termsLinkText}
                                        </a>{" "}
                                        *
                                    </span>
                                </label>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: `${dimensions.gap}px`,
                                    marginTop: `${dimensions.gap * 1.5}px`,
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
                                        padding: `${dimensions.buttonPadding}px`,
                                        backgroundColor: colors.secondaryColor,
                                        color: colors.textColor,
                                        borderRadius: `${dimensions.borderRadius * 0.75}px`,
                                        fontWeight: "600",
                                        border: "none",
                                        cursor: "pointer",
                                        transition: `all ${style.animationSpeed}ms ease`,
                                        fontSize: `${typography.buttonFontSize}px`,
                                        fontFamily: typography.fontFamily,
                                    }}
                                    disabled={isBooking}
                                >
                                    {textsForm.backButtonText}
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        flex: 2,
                                        padding: `${dimensions.buttonPadding}px`,
                                        backgroundColor: colors.primaryColor,
                                        color: "white",
                                        borderRadius: `${dimensions.borderRadius * 0.75}px`,
                                        fontWeight: "600",
                                        border: "none",
                                        cursor: isBooking
                                            ? "default"
                                            : "pointer",
                                        transition: `all ${style.animationSpeed}ms ease`,
                                        fontSize: `${typography.buttonFontSize}px`,
                                        fontFamily: typography.fontFamily,
                                        opacity: isBooking ? 0.7 : 1,
                                    }}
                                    disabled={isBooking}
                                >
                                    {isBooking
                                        ? textsForm.bookingLoadingText
                                        : textsForm.bookButtonText}
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
                        padding: `${dimensions.gap}px`,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: colors.backgroundColor,
                            borderRadius: `${dimensions.borderRadius}px`,
                            padding: `${dimensions.padding}px`,
                            width: "100%",
                            maxWidth: "500px",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
                        }}
                    >
                        <h3
                            style={{
                                fontSize: `${typography.titleFontSize * 0.8}px`,
                                fontWeight: "700",
                                textAlign: "center",
                                marginBottom: `${dimensions.gap}px`,
                                margin: `0 0 ${dimensions.gap}px 0`,
                                color: colors.successColor,
                            }}
                        >
                            🎉 {textsSuccess.successTitle}
                        </h3>

                        <div
                            style={{
                                marginBottom: `${dimensions.gap * 1.5}px`,
                            }}
                        >
                            <div
                                style={{
                                    padding: `${dimensions.gap}px`,
                                    backgroundColor: `${colors.successColor}20`,
                                    borderRadius: `${dimensions.borderRadius * 0.75}px`,
                                    border: `1px solid ${colors.successColor}40`,
                                    marginBottom: `${dimensions.gap}px`,
                                }}
                            >
                                <p
                                    style={{
                                        margin: "0",
                                        marginBottom: `${dimensions.gap * 0.5}px`,
                                    }}
                                >
                                    <strong>
                                        {textsSuccess.successBookingIdLabel}
                                    </strong>{" "}
                                    {bookingSuccess.bookingId}
                                </p>
                                <p
                                    style={{
                                        margin: "0",
                                        marginBottom: `${dimensions.gap * 0.5}px`,
                                    }}
                                >
                                    <strong>
                                        {textsSuccess.successStatusLabel}
                                    </strong>
                                    <span
                                        style={{
                                            fontWeight: "600",
                                            marginLeft: "8px",
                                            color: colors.successColor,
                                        }}
                                    >
                                        {bookingSuccess.status} ✅
                                    </span>
                                </p>
                                <p
                                    style={{
                                        margin: "0",
                                        marginBottom: `${dimensions.gap * 0.5}px`,
                                    }}
                                >
                                    <strong>
                                        {textsSuccess.successMethodLabel}
                                    </strong>
                                    <span
                                        style={{
                                            fontWeight: "600",
                                            marginLeft: "8px",
                                            color: colors.primaryColor,
                                        }}
                                    >
                                        {bookingSuccess.paymentMethod ===
                                            "bookla-integrated" &&
                                            "🎯 Bookla Intégré (Dynamique)"}
                                        {bookingSuccess.paymentMethod ===
                                            "manual" && "📧 Manuel"}
                                    </span>
                                </p>
                                <p
                                    style={{
                                        margin: "0",
                                        marginBottom: `${dimensions.gap * 0.5}px`,
                                    }}
                                >
                                    <strong>
                                        {textsSuccess.successServiceLabel}
                                    </strong>{" "}
                                    {
                                        getEnabledServices.find(
                                            (s) => s.id === selectedServiceId
                                        )?.name
                                    }
                                </p>
                                <p
                                    style={{
                                        margin: "0",
                                        marginBottom: `${dimensions.gap * 0.5}px`,
                                    }}
                                >
                                    <strong>
                                        {textsSuccess.successDateLabel}
                                    </strong>{" "}
                                    {selectedDate}
                                </p>
                                <p
                                    style={{
                                        margin: "0",
                                        marginBottom: `${dimensions.gap * 0.5}px`,
                                    }}
                                >
                                    <strong>
                                        {textsSuccess.successTimeLabel}
                                    </strong>{" "}
                                    {selectedTimeSlot &&
                                        formatTimeString(
                                            selectedTimeSlot.startTime
                                        )}
                                </p>
                                <p style={{ margin: "0" }}>
                                    <strong>
                                        {textsSuccess.successTotalLabel}
                                    </strong>{" "}
                                    {(getEnabledServices.find(
                                        (s) => s.id === selectedServiceId
                                    )?.basePrice || 0) +
                                        (getEnabledServices.find(
                                            (s) => s.id === selectedServiceId
                                        )?.apaPrice || 0)}
                                    €
                                </p>
                            </div>

                            {bookingSuccess.paymentUrl ? (
                                <div
                                    style={{
                                        padding: `${dimensions.gap}px`,
                                        backgroundColor: `${colors.primaryColor}20`,
                                        borderRadius: `${dimensions.borderRadius * 0.75}px`,
                                        border: `1px solid ${colors.primaryColor}40`,
                                    }}
                                >
                                    <p
                                        style={{
                                            color: colors.primaryColor,
                                            fontWeight: "600",
                                            marginBottom: `${dimensions.gap * 0.5}px`,
                                            margin: `0 0 ${dimensions.gap * 0.5}px 0`,
                                        }}
                                    >
                                        🔗 {textsSuccess.paymentRedirectText}
                                    </p>
                                    <p
                                        style={{
                                            fontSize: `${typography.smallTextFontSize}px`,
                                            color: colors.primaryColor,
                                            marginBottom: `${dimensions.gap * 0.75}px`,
                                            margin: `0 0 ${dimensions.gap * 0.75}px 0`,
                                        }}
                                    >
                                        {textsSuccess.paymentRedirectSubtext}
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
                                            backgroundColor:
                                                colors.primaryColor,
                                            color: "white",
                                            padding: `${dimensions.buttonPadding}px`,
                                            borderRadius: `${dimensions.borderRadius * 0.75}px`,
                                            border: "none",
                                            cursor: "pointer",
                                            transition: `all ${style.animationSpeed}ms ease`,
                                            fontWeight: "600",
                                            fontSize: `${typography.buttonFontSize}px`,
                                            fontFamily: typography.fontFamily,
                                        }}
                                    >
                                        🚀 {textsSuccess.paymentButtonText}
                                    </button>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        padding: `${dimensions.gap}px`,
                                        backgroundColor: "#fef3c7",
                                        borderRadius: `${dimensions.borderRadius * 0.75}px`,
                                        border: "1px solid #f59e0b",
                                    }}
                                >
                                    <p
                                        style={{
                                            color: "#92400e",
                                            fontWeight: "600",
                                            marginBottom: `${dimensions.gap * 0.5}px`,
                                            margin: `0 0 ${dimensions.gap * 0.5}px 0`,
                                        }}
                                    >
                                        ⚠️ {textsSuccess.manualPaymentTitle}
                                    </p>
                                    <p
                                        style={{
                                            fontSize: `${typography.smallTextFontSize}px`,
                                            color: "#92400e",
                                            margin: "0",
                                        }}
                                    >
                                        {textsSuccess.manualPaymentText}
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
                                padding: `${dimensions.buttonPadding}px`,
                                borderRadius: `${dimensions.borderRadius * 0.75}px`,
                                border: "none",
                                cursor: "pointer",
                                transition: `all ${style.animationSpeed}ms ease`,
                                fontWeight: "600",
                                fontSize: `${typography.buttonFontSize}px`,
                                fontFamily: typography.fontFamily,
                            }}
                        >
                            {textsSuccess.closeButtonText}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

// Contrôles Framer avec Services et Formulaire DYNAMIQUES
addPropertyControls(BooklaCalendarFramerDynamic, {
    booklaConfig: {
        type: ControlType.Object,
        title: "🔧 Configuration Bookla",
        controls: {
            organizationId: {
                type: ControlType.String,
                title: "Organization ID",
                defaultValue: "18566a74-b1ab-4345-948a-517f2ca10f09",
            },
            apiKey: {
                type: ControlType.String,
                title: "API Key",
                defaultValue: "teVkXn9d17cKZknCZopXDsEPz8SHs2Mf3E7r",
            },
            baseUrl: {
                type: ControlType.String,
                title: "Base URL",
                defaultValue: "https://us.bookla.com",
            },
            resourceId: {
                type: ControlType.String,
                title: "Resource ID",
                defaultValue: "8f653843-ae64-4d1a-9701-3a1ab12d133c",
            },
        },
    },

    servicesConfig: {
        type: ControlType.Object,
        title: "🚢 Services Dynamiques",
        controls: {
            numberOfServices: {
                type: ControlType.Number,
                title: "Nombre de services",
                defaultValue: 3,
                min: 1,
                max: 5,
                step: 1,
                displayStepper: true,
            },
            service1: {
                type: ControlType.Object,
                title: "Service 1",
                controls: {
                    enabled: {
                        type: ControlType.Boolean,
                        title: "Activé",
                        defaultValue: true,
                    },
                    name: {
                        type: ControlType.String,
                        title: "Nom",
                        defaultValue: "Service Journée",
                    },
                    price: {
                        type: ControlType.Number,
                        title: "Prix",
                        defaultValue: 300,
                        min: 0,
                        max: 10000,
                        step: 10,
                    },
                    apaPrice: {
                        type: ControlType.Number,
                        title: "APA",
                        defaultValue: 100,
                        min: 0,
                        max: 5000,
                        step: 10,
                    },
                    booklaId: {
                        type: ControlType.String,
                        title: "ID Bookla",
                        defaultValue: "e7c09d8e-e012-4b82-8b31-d584fa4be8ae",
                    },
                    description: {
                        type: ControlType.String,
                        title: "Description",
                        defaultValue: "Service complet pour une journée en mer",
                    },
                },
            },
            service2: {
                type: ControlType.Object,
                title: "Service 2",
                controls: {
                    enabled: {
                        type: ControlType.Boolean,
                        title: "Activé",
                        defaultValue: true,
                    },
                    name: {
                        type: ControlType.String,
                        title: "Nom",
                        defaultValue: "Service Sunset",
                    },
                    price: {
                        type: ControlType.Number,
                        title: "Prix",
                        defaultValue: 200,
                        min: 0,
                        max: 10000,
                        step: 10,
                    },
                    apaPrice: {
                        type: ControlType.Number,
                        title: "APA",
                        defaultValue: 50,
                        min: 0,
                        max: 5000,
                        step: 10,
                    },
                    booklaId: {
                        type: ControlType.String,
                        title: "ID Bookla",
                        defaultValue: "1b994905-1980-4c7d-813a-66fcb8d88f92",
                    },
                    description: {
                        type: ControlType.String,
                        title: "Description",
                        defaultValue:
                            "Escapade romantique au coucher du soleil",
                    },
                },
            },
            service3: {
                type: ControlType.Object,
                title: "Service 3",
                controls: {
                    enabled: {
                        type: ControlType.Boolean,
                        title: "Activé",
                        defaultValue: true,
                    },
                    name: {
                        type: ControlType.String,
                        title: "Nom",
                        defaultValue: "Service Mix",
                    },
                    price: {
                        type: ControlType.Number,
                        title: "Prix",
                        defaultValue: 350,
                        min: 0,
                        max: 10000,
                        step: 10,
                    },
                    apaPrice: {
                        type: ControlType.Number,
                        title: "APA",
                        defaultValue: 120,
                        min: 0,
                        max: 5000,
                        step: 10,
                    },
                    booklaId: {
                        type: ControlType.String,
                        title: "ID Bookla",
                        defaultValue: "7c3ca43d-37b4-483e-b3f6-39e8aed4afe9",
                    },
                    description: {
                        type: ControlType.String,
                        title: "Description",
                        defaultValue: "Expérience mixte personnalisée",
                    },
                },
            },
            service4: {
                type: ControlType.Object,
                title: "Service 4",
                controls: {
                    enabled: {
                        type: ControlType.Boolean,
                        title: "Activé",
                        defaultValue: false,
                    },
                    name: {
                        type: ControlType.String,
                        title: "Nom",
                        defaultValue: "Service Premium",
                    },
                    price: {
                        type: ControlType.Number,
                        title: "Prix",
                        defaultValue: 500,
                        min: 0,
                        max: 10000,
                        step: 10,
                    },
                    apaPrice: {
                        type: ControlType.Number,
                        title: "APA",
                        defaultValue: 200,
                        min: 0,
                        max: 5000,
                        step: 10,
                    },
                    booklaId: {
                        type: ControlType.String,
                        title: "ID Bookla",
                        defaultValue: "",
                    },
                    description: {
                        type: ControlType.String,
                        title: "Description",
                        defaultValue: "Service premium avec extras",
                    },
                },
            },
            service5: {
                type: ControlType.Object,
                title: "Service 5",
                controls: {
                    enabled: {
                        type: ControlType.Boolean,
                        title: "Activé",
                        defaultValue: false,
                    },
                    name: {
                        type: ControlType.String,
                        title: "Nom",
                        defaultValue: "Service Express",
                    },
                    price: {
                        type: ControlType.Number,
                        title: "Prix",
                        defaultValue: 150,
                        min: 0,
                        max: 10000,
                        step: 10,
                    },
                    apaPrice: {
                        type: ControlType.Number,
                        title: "APA",
                        defaultValue: 30,
                        min: 0,
                        max: 5000,
                        step: 10,
                    },
                    booklaId: {
                        type: ControlType.String,
                        title: "ID Bookla",
                        defaultValue: "",
                    },
                    description: {
                        type: ControlType.String,
                        title: "Description",
                        defaultValue: "Service rapide 2h",
                    },
                },
            },
        },
    },

    formConfig: {
        type: ControlType.Object,
        title: "📝 Formulaire Dynamique",
        controls: {
            fields: {
                type: ControlType.Object,
                title: "Champs Standards",
                controls: {
                    firstName: {
                        type: ControlType.Object,
                        title: "Prénom",
                        controls: {
                            enabled: {
                                type: ControlType.Boolean,
                                title: "Activé",
                                defaultValue: true,
                            },
                            required: {
                                type: ControlType.Boolean,
                                title: "Obligatoire",
                                defaultValue: true,
                            },
                            label: {
                                type: ControlType.String,
                                title: "Label",
                                defaultValue: "Prénom",
                            },
                            placeholder: {
                                type: ControlType.String,
                                title: "Placeholder",
                                defaultValue: "Votre prénom",
                            },
                        },
                    },
                    lastName: {
                        type: ControlType.Object,
                        title: "Nom",
                        controls: {
                            enabled: {
                                type: ControlType.Boolean,
                                title: "Activé",
                                defaultValue: true,
                            },
                            required: {
                                type: ControlType.Boolean,
                                title: "Obligatoire",
                                defaultValue: true,
                            },
                            label: {
                                type: ControlType.String,
                                title: "Label",
                                defaultValue: "Nom",
                            },
                            placeholder: {
                                type: ControlType.String,
                                title: "Placeholder",
                                defaultValue: "Votre nom",
                            },
                        },
                    },
                    email: {
                        type: ControlType.Object,
                        title: "Email",
                        controls: {
                            enabled: {
                                type: ControlType.Boolean,
                                title: "Activé",
                                defaultValue: true,
                            },
                            required: {
                                type: ControlType.Boolean,
                                title: "Obligatoire",
                                defaultValue: true,
                            },
                            label: {
                                type: ControlType.String,
                                title: "Label",
                                defaultValue: "Email",
                            },
                            placeholder: {
                                type: ControlType.String,
                                title: "Placeholder",
                                defaultValue: "votre@email.com",
                            },
                        },
                    },
                    phone: {
                        type: ControlType.Object,
                        title: "Téléphone",
                        controls: {
                            enabled: {
                                type: ControlType.Boolean,
                                title: "Activé",
                                defaultValue: true,
                            },
                            required: {
                                type: ControlType.Boolean,
                                title: "Obligatoire",
                                defaultValue: true,
                            },
                            label: {
                                type: ControlType.String,
                                title: "Label",
                                defaultValue: "Téléphone",
                            },
                            placeholder: {
                                type: ControlType.String,
                                title: "Placeholder",
                                defaultValue: "+33 6 12 34 56 78",
                            },
                        },
                    },
                    company: {
                        type: ControlType.Object,
                        title: "Entreprise",
                        controls: {
                            enabled: {
                                type: ControlType.Boolean,
                                title: "Activé",
                                defaultValue: false,
                            },
                            required: {
                                type: ControlType.Boolean,
                                title: "Obligatoire",
                                defaultValue: false,
                            },
                            label: {
                                type: ControlType.String,
                                title: "Label",
                                defaultValue: "Entreprise",
                            },
                            placeholder: {
                                type: ControlType.String,
                                title: "Placeholder",
                                defaultValue: "Nom de votre entreprise",
                            },
                        },
                    },
                    address: {
                        type: ControlType.Object,
                        title: "Adresse",
                        controls: {
                            enabled: {
                                type: ControlType.Boolean,
                                title: "Activé",
                                defaultValue: false,
                            },
                            required: {
                                type: ControlType.Boolean,
                                title: "Obligatoire",
                                defaultValue: false,
                            },
                            label: {
                                type: ControlType.String,
                                title: "Label",
                                defaultValue: "Adresse",
                            },
                            placeholder: {
                                type: ControlType.String,
                                title: "Placeholder",
                                defaultValue: "Votre adresse",
                            },
                        },
                    },
                    specialRequests: {
                        type: ControlType.Object,
                        title: "Demandes spéciales",
                        controls: {
                            enabled: {
                                type: ControlType.Boolean,
                                title: "Activé",
                                defaultValue: false,
                            },
                            required: {
                                type: ControlType.Boolean,
                                title: "Obligatoire",
                                defaultValue: false,
                            },
                            label: {
                                type: ControlType.String,
                                title: "Label",
                                defaultValue: "Demandes spéciales",
                            },
                            placeholder: {
                                type: ControlType.String,
                                title: "Placeholder",
                                defaultValue: "Vos demandes particulières...",
                            },
                        },
                    },
                    numberOfPeople: {
                        type: ControlType.Object,
                        title: "Nombre de personnes",
                        controls: {
                            enabled: {
                                type: ControlType.Boolean,
                                title: "Activé",
                                defaultValue: false,
                            },
                            required: {
                                type: ControlType.Boolean,
                                title: "Obligatoire",
                                defaultValue: false,
                            },
                            label: {
                                type: ControlType.String,
                                title: "Label",
                                defaultValue: "Nombre de personnes",
                            },
                            placeholder: {
                                type: ControlType.String,
                                title: "Placeholder",
                                defaultValue: "Ex: 4",
                            },
                        },
                    },
                },
            },
            customFields: {
                type: ControlType.Object,
                title: "Champs Personnalisés",
                controls: {
                    field1: {
                        type: ControlType.Object,
                        title: "Champ personnalisé 1",
                        controls: {
                            enabled: {
                                type: ControlType.Boolean,
                                title: "Activé",
                                defaultValue: false,
                            },
                            required: {
                                type: ControlType.Boolean,
                                title: "Obligatoire",
                                defaultValue: false,
                            },
                            label: {
                                type: ControlType.String,
                                title: "Label",
                                defaultValue: "Champ personnalisé 1",
                            },
                            placeholder: {
                                type: ControlType.String,
                                title: "Placeholder",
                                defaultValue: "Valeur personnalisée",
                            },
                            type: {
                                type: ControlType.Enum,
                                title: "Type",
                                defaultValue: "text",
                                options: ["text", "email", "tel", "textarea"],
                                optionTitles: [
                                    "Texte",
                                    "Email",
                                    "Téléphone",
                                    "Zone de texte",
                                ],
                            },
                        },
                    },
                    field2: {
                        type: ControlType.Object,
                        title: "Champ personnalisé 2",
                        controls: {
                            enabled: {
                                type: ControlType.Boolean,
                                title: "Activé",
                                defaultValue: false,
                            },
                            required: {
                                type: ControlType.Boolean,
                                title: "Obligatoire",
                                defaultValue: false,
                            },
                            label: {
                                type: ControlType.String,
                                title: "Label",
                                defaultValue: "Champ personnalisé 2",
                            },
                            placeholder: {
                                type: ControlType.String,
                                title: "Placeholder",
                                defaultValue: "Autre valeur",
                            },
                            type: {
                                type: ControlType.Enum,
                                title: "Type",
                                defaultValue: "text",
                                options: ["text", "email", "tel", "textarea"],
                                optionTitles: [
                                    "Texte",
                                    "Email",
                                    "Téléphone",
                                    "Zone de texte",
                                ],
                            },
                        },
                    },
                },
            },
        },
    },

    urlsConfig: {
        type: ControlType.Object,
        title: "🌐 URLs",
        controls: {
            successUrl: {
                type: ControlType.String,
                title: "URL Succès",
                defaultValue: "https://loupinedou-yacht.fr/confirmation-page",
            },
            cancelUrl: {
                type: ControlType.String,
                title: "URL Annulation",
                defaultValue: "https://loupinedou-yacht.fr/error-page",
            },
            termsUrl: {
                type: ControlType.String,
                title: "URL Conditions",
                defaultValue: "https://loupinedou-yacht.fr/conditions",
            },
        },
    },

    textsInterface: {
        type: ControlType.Object,
        title: "📝 Textes Interface",
        controls: {
            title: {
                type: ControlType.String,
                title: "Titre",
                defaultValue: "Réservation de Bateau",
            },
            subtitle: {
                type: ControlType.String,
                title: "Sous-titre",
                defaultValue:
                    "Sélectionnez une date disponible pour réserver votre service",
            },
            selectServiceLabel: {
                type: ControlType.String,
                title: "Label service",
                defaultValue: "Sélectionnez votre service :",
            },
            priceLabel: {
                type: ControlType.String,
                title: "Label prix",
                defaultValue: "Prix:",
            },
            apaLabel: {
                type: ControlType.String,
                title: "Label APA",
                defaultValue: "d'APA",
            },
            totalLabel: {
                type: ControlType.String,
                title: "Label total",
                defaultValue: "Total:",
            },
            todayButtonText: {
                type: ControlType.String,
                title: "Bouton aujourd'hui",
                defaultValue: "Aujourd'hui",
            },
            availableText: {
                type: ControlType.String,
                title: "Texte disponible",
                defaultValue: "Disponible",
            },
            loadingText: {
                type: ControlType.String,
                title: "Texte chargement",
                defaultValue: "Chargement des disponibilités...",
            },
            errorRetryText: {
                type: ControlType.String,
                title: "Texte réessayer",
                defaultValue: "Réessayer",
            },
        },
    },

    textsForm: {
        type: ControlType.Object,
        title: "📋 Textes Formulaire",
        controls: {
            chooseTimeTitle: {
                type: ControlType.String,
                title: "Titre horaire",
                defaultValue: "Choisissez un horaire",
            },
            bookingFormTitle: {
                type: ControlType.String,
                title: "Titre formulaire",
                defaultValue: "Réservation",
            },
            summaryTitle: {
                type: ControlType.String,
                title: "Titre récapitulatif",
                defaultValue: "Récapitulatif",
            },
            termsText: {
                type: ControlType.String,
                title: "Texte conditions",
                defaultValue: "J'accepte les",
            },
            termsLinkText: {
                type: ControlType.String,
                title: "Lien conditions",
                defaultValue: "conditions générales",
            },
            backButtonText: {
                type: ControlType.String,
                title: "Bouton retour",
                defaultValue: "Retour",
            },
            bookButtonText: {
                type: ControlType.String,
                title: "Bouton réserver",
                defaultValue: "Réserver",
            },
            cancelButtonText: {
                type: ControlType.String,
                title: "Bouton annuler",
                defaultValue: "Annuler",
            },
            bookingLoadingText: {
                type: ControlType.String,
                title: "Chargement",
                defaultValue: "Création en cours...",
            },
            requiredFieldsText: {
                type: ControlType.String,
                title: "Note champs obligatoires",
                defaultValue: "Les champs marqués d'un * sont obligatoires",
            },
        },
    },

    textsSuccess: {
        type: ControlType.Object,
        title: "🎉 Textes Succès",
        controls: {
            successTitle: {
                type: ControlType.String,
                title: "Titre",
                defaultValue: "Réservation créée !",
            },
            successBookingIdLabel: {
                type: ControlType.String,
                title: "Label ID",
                defaultValue: "ID de réservation:",
            },
            successStatusLabel: {
                type: ControlType.String,
                title: "Label statut",
                defaultValue: "Statut:",
            },
            successMethodLabel: {
                type: ControlType.String,
                title: "Label méthode",
                defaultValue: "Méthode de paiement:",
            },
            successServiceLabel: {
                type: ControlType.String,
                title: "Label service",
                defaultValue: "Service:",
            },
            successDateLabel: {
                type: ControlType.String,
                title: "Label date",
                defaultValue: "Date:",
            },
            successTimeLabel: {
                type: ControlType.String,
                title: "Label horaire",
                defaultValue: "Horaire:",
            },
            successTotalLabel: {
                type: ControlType.String,
                title: "Label total",
                defaultValue: "Total:",
            },
            paymentRedirectText: {
                type: ControlType.String,
                title: "Redirection",
                defaultValue: "Redirection vers paiement en cours...",
            },
            paymentRedirectSubtext: {
                type: ControlType.String,
                title: "Sous-redirection",
                defaultValue:
                    "Vous serez redirigé automatiquement dans 3 secondes.",
            },
            paymentButtonText: {
                type: ControlType.String,
                title: "Bouton paiement",
                defaultValue: "Procéder au paiement maintenant",
            },
            manualPaymentTitle: {
                type: ControlType.String,
                title: "Titre manuel",
                defaultValue: "Paiement automatique indisponible",
            },
            manualPaymentText: {
                type: ControlType.String,
                title: "Contenu manuel",
                defaultValue: "Votre réservation est créée et sécurisée.",
            },
            closeButtonText: {
                type: ControlType.String,
                title: "Bouton fermer",
                defaultValue: "Fermer et actualiser",
            },
        },
    },

    colors: {
        type: ControlType.Object,
        title: "🎨 Couleurs",
        controls: {
            primaryColor: {
                type: ControlType.Color,
                title: "Principale",
                defaultValue: "#16a34a",
            },
            secondaryColor: {
                type: ControlType.Color,
                title: "Secondaire",
                defaultValue: "#f1f5f9",
            },
            backgroundColor: {
                type: ControlType.Color,
                title: "Fond",
                defaultValue: "#ffffff",
            },
            textColor: {
                type: ControlType.Color,
                title: "Texte",
                defaultValue: "#374151",
            },
            borderColor: {
                type: ControlType.Color,
                title: "Bordures",
                defaultValue: "#e2e8f0",
            },
            successColor: {
                type: ControlType.Color,
                title: "Succès",
                defaultValue: "#16a34a",
            },
            errorColor: {
                type: ControlType.Color,
                title: "Erreur",
                defaultValue: "#dc2626",
            },
            availableDateColor: {
                type: ControlType.Color,
                title: "Date disponible",
                defaultValue: "#dcfce7",
            },
            availableDateBorderColor: {
                type: ControlType.Color,
                title: "Bordure disponible",
                defaultValue: "#bbf7d0",
            },
            currentDayColor: {
                type: ControlType.Color,
                title: "Jour actuel",
                defaultValue: "#16a34a",
            },
            currentDayBackgroundColor: {
                type: ControlType.Color,
                title: "Fond jour actuel",
                defaultValue: "#16a34a20",
            },
        },
    },

    typography: {
        type: ControlType.Object,
        title: "🔤 Typographie",
        controls: {
            fontFamily: {
                type: ControlType.String,
                title: "Police",
                defaultValue:
                    "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            },
            titleFontSize: {
                type: ControlType.Number,
                title: "Taille titre",
                defaultValue: 28,
                min: 16,
                max: 48,
                step: 2,
            },
            subtitleFontSize: {
                type: ControlType.Number,
                title: "Taille sous-titre",
                defaultValue: 18,
                min: 12,
                max: 32,
                step: 1,
            },
            labelFontSize: {
                type: ControlType.Number,
                title: "Taille labels",
                defaultValue: 18,
                min: 12,
                max: 28,
                step: 1,
            },
            textFontSize: {
                type: ControlType.Number,
                title: "Taille texte",
                defaultValue: 16,
                min: 12,
                max: 24,
                step: 1,
            },
            smallTextFontSize: {
                type: ControlType.Number,
                title: "Taille petit",
                defaultValue: 14,
                min: 10,
                max: 20,
                step: 1,
            },
            buttonFontSize: {
                type: ControlType.Number,
                title: "Taille boutons",
                defaultValue: 16,
                min: 12,
                max: 24,
                step: 1,
            },
        },
    },

    dimensions: {
        type: ControlType.Object,
        title: "📐 Dimensions",
        controls: {
            borderRadius: {
                type: ControlType.Number,
                title: "Rayon bordures",
                defaultValue: 12,
                min: 0,
                max: 30,
                step: 2,
            },
            padding: {
                type: ControlType.Number,
                title: "Espacement interne",
                defaultValue: 32,
                min: 16,
                max: 64,
                step: 4,
            },
            gap: {
                type: ControlType.Number,
                title: "Espacement éléments",
                defaultValue: 16,
                min: 8,
                max: 32,
                step: 2,
            },
            buttonPadding: {
                type: ControlType.Number,
                title: "Padding boutons",
                defaultValue: 12,
                min: 8,
                max: 24,
                step: 2,
            },
            inputPadding: {
                type: ControlType.Number,
                title: "Padding inputs",
                defaultValue: 12,
                min: 8,
                max: 24,
                step: 2,
            },
            width: {
                type: ControlType.Number,
                title: "Largeur",
                defaultValue: 800,
                min: 400,
                max: 1200,
                step: 50,
            },
            height: {
                type: ControlType.Number,
                title: "Hauteur",
                defaultValue: 900,
                min: 600,
                max: 1400,
                step: 50,
            },
        },
    },

    style: {
        type: ControlType.Object,
        title: "🏷️ Style",
        controls: {
            showBadge: {
                type: ControlType.Boolean,
                title: "Afficher badge",
                defaultValue: true,
            },
            badgeText: {
                type: ControlType.String,
                title: "Texte badge",
                defaultValue: "Frontend-Only",
            },
            badgeColor: {
                type: ControlType.Color,
                title: "Couleur badge",
                defaultValue: "#8b5cf6",
            },
            animationSpeed: {
                type: ControlType.Number,
                title: "Vitesse animations",
                defaultValue: 300,
                min: 100,
                max: 1000,
                step: 50,
            },
        },
    },
})

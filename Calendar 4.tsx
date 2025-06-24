import React, { useState, useEffect, useCallback } from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * BOOKLA CALENDAR COMPONENT FOR FRAMER
 * ===================================
 *
 * This is a complete booking calendar component that integrates with Bookla API.
 * It supports dynamic services, configurable form fields, and full customization.
 *
 * Features:
 * - Dynamic services configuration (1-10 services)
 * - Configurable API credentials
 * - Dynamic form fields with show/hide and required/optional
 * - Full text customization
 * - Complete styling control
 * - Responsive layout with configurable spacing
 * - Client API priority with Merchant API fallback
 *
 * Author: Created for Loupinedou Yacht
 * Version: 1.0 Complete
 */

// Calendar constants for French localization
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

/**
 * Utility function to format date to ISO string
 * @param date - JavaScript Date object
 * @returns ISO date string (YYYY-MM-DD format)
 */
function formatDateString(date: Date): string {
    return date.toISOString().split("T")[0]
}

/**
 * Utility function to format time string for display
 * @param dateTimeString - ISO datetime string
 * @returns Formatted time string (HH:MM format)
 */
function formatTimeString(dateTimeString: string): string {
    const date = new Date(dateTimeString)
    return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    })
}

/**
 * Interface for time slots returned by Bookla API
 */
interface TimeSlot {
    startTime: string
    endTime?: string
    resourceId: string
}

/**
 * Interface for customer information collected in the booking form
 */
interface CustomerInfo {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    zipCode: string
    company: string
    comments: string
    termsAccepted: boolean
    privacyAccepted: boolean
    newsletterAccepted: boolean
}

/**
 * Interface for service configuration
 */
interface ServiceConfig {
    enabled: boolean
    id: string
    name: string
    description: string
    basePrice: number
    apaPrice: number
    duration: string
}

/**
 * Main Bookla Calendar Component
 * This component handles the complete booking flow from calendar display to payment
 */
export default function BooklaCalendarFramerComplete(props: any) {
    // Destructure props with default values
    const {
        // API Configuration - All Bookla API settings
        apiConfig = {
            organizationId: "18566a74-b1ab-4345-948a-517f2ca10f09",
            apiKey: "teVkXn9d17cKZknCZopXDsEPz8SHs2Mf3E7r",
            baseUrl: "https://us.bookla.com",
            resourceId: "8f653843-ae64-4d1a-9701-3a1ab12d133c",
        },

        // Text Configuration - All displayed texts are customizable
        texts = {
            title: "Réservation de Bateau",
            subtitle:
                "Sélectionnez une date disponible pour réserver votre service",
            serviceLabel: "Sélectionnez votre service :",
            todayButton: "Aujourd'hui",
            availableLabel: "Disponible",
            loadingText: "Chargement des disponibilités...",
            errorRetryButton: "Réessayer",
            chooseTimeTitle: "Choisissez un horaire",
            bookingTitle: "Réservation",
            bookingButton: "Réserver",
            bookingInProgress: "Réservation...",
            backButton: "Retour",
            cancelButton: "Annuler",
            closeButton: "Fermer",
            successTitle: "🎉 Réservation créée !",
            paymentRedirectText: "🚀 Redirection vers le paiement...",
            emailInstructionsText: "📧 Instructions envoyées par email",
            footerText: "Paiement sécurisé 100% géré par Bookla",
            // Show/hide toggles for text elements
            showTitle: true,
            showSubtitle: true,
            showServiceLabel: true,
            showFooterText: true,
        },

        // URL Configuration - Links for various actions
        urls = {
            successUrl: "https://loupinedou-yacht.fr/confirmation-page",
            cancelUrl: "https://loupinedou-yacht.fr/error-page",
            termsUrl: "https://loupinedou-yacht.fr/conditions",
            privacyUrl: "https://loupinedou-yacht.fr/privacy",
        },

        // Services Configuration - Dynamic service management
        servicesCount = 3, // Number of services to display (1-10)

        // Individual service configurations (dynamically handled)
        service1 = {
            enabled: true,
            id: "e7c09d8e-e012-4b82-8b31-d584fa4be8ae",
            name: "Service Journée",
            description: "Une journée complète de navigation",
            basePrice: 300,
            apaPrice: 100,
            duration: "8 heures",
        },
        service2 = {
            enabled: true,
            id: "1b994905-1980-4c7d-813a-66fcb8d88f92",
            name: "Service Sunset",
            description: "Navigation au coucher du soleil",
            basePrice: 200,
            apaPrice: 50,
            duration: "4 heures",
        },
        service3 = {
            enabled: true,
            id: "7c3ca43d-37b4-483e-b3f6-39e8aed4afe9",
            name: "Service Mix",
            description: "Formule personnalisée",
            basePrice: 350,
            apaPrice: 120,
            duration: "Sur mesure",
        },
        service4 = {
            enabled: false,
            id: "service-4-id",
            name: "Service 4",
            description: "Description du service 4",
            basePrice: 100,
            apaPrice: 50,
            duration: "2 heures",
        },
        service5 = {
            enabled: false,
            id: "service-5-id",
            name: "Service 5",
            description: "Description du service 5",
            basePrice: 100,
            apaPrice: 50,
            duration: "2 heures",
        },
        service6 = {
            enabled: false,
            id: "service-6-id",
            name: "Service 6",
            description: "Description du service 6",
            basePrice: 100,
            apaPrice: 50,
            duration: "2 heures",
        },
        service7 = {
            enabled: false,
            id: "service-7-id",
            name: "Service 7",
            description: "Description du service 7",
            basePrice: 100,
            apaPrice: 50,
            duration: "2 heures",
        },
        service8 = {
            enabled: false,
            id: "service-8-id",
            name: "Service 8",
            description: "Description du service 8",
            basePrice: 100,
            apaPrice: 50,
            duration: "2 heures",
        },
        service9 = {
            enabled: false,
            id: "service-9-id",
            name: "Service 9",
            description: "Description du service 9",
            basePrice: 100,
            apaPrice: 50,
            duration: "2 heures",
        },
        service10 = {
            enabled: false,
            id: "service-10-id",
            name: "Service 10",
            description: "Description du service 10",
            basePrice: 100,
            apaPrice: 50,
            duration: "2 heures",
        },

        // Form Fields Configuration - Each field can be shown/hidden and required/optional
        formFields = {
            firstName: {
                show: true,
                required: true,
                label: "Prénom",
                placeholder: "Votre prénom",
            },
            lastName: {
                show: true,
                required: true,
                label: "Nom",
                placeholder: "Votre nom",
            },
            email: {
                show: true,
                required: true,
                label: "Email",
                placeholder: "votre@email.com",
            },
            phone: {
                show: true,
                required: true,
                label: "Téléphone",
                placeholder: "0123456789",
            },
            address: {
                show: false,
                required: false,
                label: "Adresse",
                placeholder: "Votre adresse",
            },
            city: {
                show: false,
                required: false,
                label: "Ville",
                placeholder: "Votre ville",
            },
            zipCode: {
                show: false,
                required: false,
                label: "Code postal",
                placeholder: "12345",
            },
            company: {
                show: false,
                required: false,
                label: "Entreprise",
                placeholder: "Nom de votre entreprise",
            },
            comments: {
                show: false,
                required: false,
                label: "Commentaires",
                placeholder: "Vos commentaires...",
            },
        },

        // Checkbox Configuration - Terms, privacy, and newsletter options
        checkboxes = {
            terms: {
                show: true,
                required: true,
                label: "J'accepte les conditions générales",
            },
            privacy: {
                show: false,
                required: false,
                label: "J'accepte la politique de confidentialité",
            },
            newsletter: {
                show: false,
                required: false,
                label: "Je souhaite recevoir la newsletter",
            },
        },

        // Theme Configuration - Visual styling options
        theme = {
            primaryColor: "#16a34a",
            secondaryColor: "#f1f5f9",
            backgroundColor: "#ffffff",
            textColor: "#374151",
            borderColor: "#e2e8f0",
            fontFamily:
                "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: 16,
            borderRadius: 12,
        },

        // Layout Configuration - Spacing and dimensions
        layout = {
            width: 800,
            height: 900,
            containerPadding: 32,
            sectionSpacing: 32,
            elementSpacing: 16,
            calendarGap: 8,
            modalPadding: 32,
            enableScroll: true, // Enable scrolling when content overflows
        },

        // Feature Configuration - Toggle various features on/off
        features = {
            showPrices: true,
            showDescriptions: true,
            showDuration: true,
            debugMode: false, // Enable debug logging to console
        },
    } = props

    /**
     * SERVICES BUILDING LOGIC - FIXED VERSION
     * This creates the active services array from individual service props
     */
    const allServices = [
        service1,
        service2,
        service3,
        service4,
        service5,
        service6,
        service7,
        service8,
        service9,
        service10,
    ]

    // Build active services array based on servicesCount and enabled status
    const activeServices = allServices
        .slice(0, servicesCount) // Only take the number of services specified
        .filter((service) => service && service.enabled) // Only include enabled services

    // Debug logging for services
    console.log("🔧 Services Debug:", {
        servicesCount,
        allServicesLength: allServices.length,
        activeServicesLength: activeServices.length,
        activeServices: activeServices.map((s) => ({
            name: s.name,
            enabled: s.enabled,
        })),
    })

    // Component State Management
    const today = new Date()
    const [currentYear, setCurrentYear] = useState(today.getFullYear())
    const [currentMonth, setCurrentMonth] = useState(today.getMonth())
    const [selectedServiceId, setSelectedServiceId] = useState(
        activeServices[0]?.id || ""
    )
    const [availableSlots, setAvailableSlots] = useState<{
        [date: string]: TimeSlot[]
    }>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Booking Flow State
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
        null
    )
    const [showTimeSelection, setShowTimeSelection] = useState(false)
    const [showBookingForm, setShowBookingForm] = useState(false)
    const [isBooking, setIsBooking] = useState(false)
    const [bookingSuccess, setBookingSuccess] = useState<{
        bookingId: string
        status: string
        paymentUrl?: string
        manualPayment?: boolean
        apiUsed?: string
    } | null>(null)

    // Customer Form Data
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zipCode: "",
        company: "",
        comments: "",
        termsAccepted: false,
        privacyAccepted: false,
        newsletterAccepted: false,
    })

    /**
     * Debug logging function
     * Only logs when debugMode is enabled in features
     */
    const debugLog = useCallback(
        (message: string, data?: any) => {
            if (features.debugMode) {
                console.log(`🔧 [Bookla Debug] ${message}`, data || "")
            }
        },
        [features.debugMode]
    )

    /**
     * Auto-select first service when services change
     * This ensures there's always a selected service when services are available
     */
    useEffect(() => {
        if (activeServices.length > 0 && !selectedServiceId) {
            setSelectedServiceId(activeServices[0].id)
            debugLog("Auto-selected first service", activeServices[0])
        }
    }, [activeServices, selectedServiceId, debugLog])

    /**
     * MAIN API CALL - Fetch availability from Bookla
     * This hook fetches available time slots for the current month and selected service
     */
    useEffect(() => {
        // Don't fetch if no service is selected or no services are available
        if (!selectedServiceId || activeServices.length === 0) {
            debugLog(
                "Skipping availability fetch - no service selected or no active services"
            )
            return
        }

        const fetchAvailability = async () => {
            setLoading(true)
            setError(null)
            debugLog("Starting availability fetch")

            try {
                // Calculate date range for current month
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

                debugLog(`Date range: ${fromDate} → ${toDate}`)
                debugLog("API Config:", apiConfig)
                debugLog("Selected Service ID:", selectedServiceId)

                // Construct Bookla API URL
                const apiUrl = `${apiConfig.baseUrl}/api/v1/companies/${apiConfig.organizationId}/services/${selectedServiceId}/times`

                // Make API request to Bookla
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "X-API-Key": apiConfig.apiKey,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        from: fromDate,
                        to: toDate,
                        spots: 1, // Number of spots to book
                    }),
                })

                if (!response.ok) {
                    const errorText = await response.text()
                    debugLog(`API Error: ${response.status} - ${errorText}`)
                    throw new Error(
                        `Bookla API Error: ${response.status} - ${errorText}`
                    )
                }

                const apiData = await response.json()
                debugLog("API Response:", apiData)

                // Process API response and group slots by date
                const slotsGroupedByDate: { [date: string]: TimeSlot[] } = {}

                if (apiData && apiData.times) {
                    Object.entries(apiData.times).forEach(
                        ([resourceId, resourceSlots]: [string, any]) => {
                            if (Array.isArray(resourceSlots)) {
                                resourceSlots.forEach((slot: any) => {
                                    if (slot.startTime) {
                                        const slotDate =
                                            slot.startTime.split("T")[0]
                                        if (!slotsGroupedByDate[slotDate]) {
                                            slotsGroupedByDate[slotDate] = []
                                        }
                                        slotsGroupedByDate[slotDate].push({
                                            startTime: slot.startTime,
                                            endTime: slot.endTime,
                                            resourceId: resourceId,
                                        })
                                    }
                                })
                            }
                        }
                    )
                }

                // Sort slots by time for each date
                Object.keys(slotsGroupedByDate).forEach((date) => {
                    slotsGroupedByDate[date].sort(
                        (a, b) =>
                            new Date(a.startTime).getTime() -
                            new Date(b.startTime).getTime()
                    )
                })

                debugLog(
                    `Found ${Object.keys(slotsGroupedByDate).length} available dates`
                )
                setAvailableSlots(slotsGroupedByDate)
            } catch (err: any) {
                debugLog("Error loading availability", err)
                setError(err.message || "Unable to load availability")
            } finally {
                setLoading(false)
            }
        }

        fetchAvailability()
    }, [
        currentYear,
        currentMonth,
        selectedServiceId,
        debugLog,
        activeServices.length,
        apiConfig,
    ])

    /**
     * Force reload function for error recovery
     */
    const forceReload = useCallback(() => {
        debugLog("Force reloading calendar")
        window.location.reload()
    }, [debugLog])

    /**
     * Calendar Navigation Functions
     */
    const navigateToPreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentYear((prev) => prev - 1)
            setCurrentMonth(11)
        } else {
            setCurrentMonth((prev) => prev - 1)
        }
    }

    const navigateToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentYear((prev) => prev + 1)
            setCurrentMonth(0)
        } else {
            setCurrentMonth((prev) => prev + 1)
        }
    }

    const returnToCurrentMonth = () => {
        setCurrentYear(today.getFullYear())
        setCurrentMonth(today.getMonth())
    }

    /**
     * Booking Flow Functions
     */
    const handleDateSelection = (dateString: string) => {
        setSelectedDate(dateString)
        setSelectedTimeSlot(null)
        setShowTimeSelection(true)
    }

    const handleTimeSlotSelection = (timeSlot: TimeSlot) => {
        setSelectedTimeSlot(timeSlot)
        setShowTimeSelection(false)
        setShowBookingForm(true)
    }

    /**
     * Form input change handler
     */
    const handleCustomerInfoChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target
        const checked = "checked" in e.target ? e.target.checked : false

        setCustomerInfo({
            ...customerInfo,
            [name]: type === "checkbox" ? checked : value,
        })
    }

    /**
     * MAIN BOOKING SUBMISSION FUNCTION
     * Handles the complete booking flow with Client API priority and Merchant API fallback
     */
    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Dynamic form validation based on configuration
        if (
            checkboxes.terms.show &&
            checkboxes.terms.required &&
            !customerInfo.termsAccepted
        ) {
            alert("You must accept the terms and conditions")
            return
        }

        if (
            checkboxes.privacy.show &&
            checkboxes.privacy.required &&
            !customerInfo.privacyAccepted
        ) {
            alert("You must accept the privacy policy")
            return
        }

        // Validate required fields dynamically
        const requiredFields = Object.entries(formFields).filter(
            ([_, field]) => field.show && field.required
        )
        for (const [fieldName, field] of requiredFields) {
            const value = customerInfo[fieldName as keyof CustomerInfo]
            if (typeof value === "string" && !value.trim()) {
                alert(`${field.label} is required`)
                return
            }
        }

        if (!selectedTimeSlot) {
            alert("No time slot selected")
            return
        }

        setIsBooking(true)
        debugLog("Starting booking process", { selectedTimeSlot, customerInfo })

        try {
            const service = activeServices.find(
                (s) => s.id === selectedServiceId
            )
            if (!service) throw new Error("Service not found")

            debugLog(
                "🚀 === STARTING BOOKING WORKFLOW - CLIENT API PRIORITY ==="
            )

            /**
             * PRIORITY 1: BOOKLA CLIENT API
             * This API is preferred as it handles customer data better
             */
            const clientPayload = {
                client: {
                    email: customerInfo.email.trim().toLowerCase(),
                    firstName: customerInfo.firstName.trim(),
                    lastName: customerInfo.lastName.trim(),
                    phone: customerInfo.phone.trim(),
                    // Add optional fields only if they are shown and have values
                    ...(formFields.address.show &&
                        customerInfo.address && {
                            address: customerInfo.address.trim(),
                        }),
                    ...(formFields.city.show &&
                        customerInfo.city && {
                            city: customerInfo.city.trim(),
                        }),
                    ...(formFields.zipCode.show &&
                        customerInfo.zipCode && {
                            zipCode: customerInfo.zipCode.trim(),
                        }),
                    ...(formFields.company.show &&
                        customerInfo.company && {
                            company: customerInfo.company.trim(),
                        }),
                },
                companyID: apiConfig.organizationId,
                serviceID: selectedServiceId,
                resourceID: selectedTimeSlot.resourceId || apiConfig.resourceId,
                startTime: selectedTimeSlot.startTime,
                spots: 1,
                customPurchaseDescription: `Booking ${service.name} - ${texts.title}`,
                metaData: {
                    source: "framer_component_client_priority",
                    booking_policy: "prepayment",
                    payment_method: "bookla_integrated",
                    total_amount: features.showPrices
                        ? (service.basePrice + service.apaPrice).toString()
                        : "0",
                    service_name: service.name,
                    service_description: features.showDescriptions
                        ? service.description
                        : undefined,
                    service_duration: features.showDuration
                        ? service.duration
                        : undefined,
                    comments:
                        formFields.comments.show && customerInfo.comments
                            ? customerInfo.comments.trim()
                            : undefined,
                    newsletter_opt_in: checkboxes.newsletter.show
                        ? customerInfo.newsletterAccepted
                        : false,
                    privacy_accepted: checkboxes.privacy.show
                        ? customerInfo.privacyAccepted
                        : true,
                    created_at: new Date().toISOString(),
                    success_url: urls.successUrl,
                    cancel_url: urls.cancelUrl,
                    terms_url: urls.termsUrl,
                    privacy_url: urls.privacyUrl,
                },
            }

            debugLog("🎯 ATTEMPT 1: CLIENT API (PRIORITY)", clientPayload)

            let bookingResponse = await fetch(
                `${apiConfig.baseUrl}/api/v1/client/bookings`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${apiConfig.apiKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(clientPayload),
                }
            )

            let apiUsed = "Client API"

            /**
             * FALLBACK: BOOKLA MERCHANT API
             * If Client API fails, try Merchant API as backup
             */
            if (!bookingResponse.ok) {
                debugLog("❌ Client API failed, trying Merchant API (fallback)")

                const merchantPayload = {
                    companyID: apiConfig.organizationId,
                    serviceID: selectedServiceId,
                    resourceID:
                        selectedTimeSlot.resourceId || apiConfig.resourceId,
                    startTime: selectedTimeSlot.startTime,
                    endTime: selectedTimeSlot.endTime,
                    spots: 1,
                    client: {
                        firstName: customerInfo.firstName.trim(),
                        lastName: customerInfo.lastName.trim(),
                        email: customerInfo.email.trim().toLowerCase(),
                        phone: customerInfo.phone.trim(),
                        ...(formFields.address.show &&
                            customerInfo.address && {
                                address: customerInfo.address.trim(),
                            }),
                        ...(formFields.city.show &&
                            customerInfo.city && {
                                city: customerInfo.city.trim(),
                            }),
                        ...(formFields.zipCode.show &&
                            customerInfo.zipCode && {
                                zipCode: customerInfo.zipCode.trim(),
                            }),
                        ...(formFields.company.show &&
                            customerInfo.company && {
                                company: customerInfo.company.trim(),
                            }),
                    },
                    status: "pending",
                    requirePayment: true,
                    termsAccepted: customerInfo.termsAccepted,
                    metadata: {
                        source: "framer_component_merchant_fallback",
                        payment_method: "bookla_integrated",
                        total_amount: features.showPrices
                            ? (service.basePrice + service.apaPrice).toString()
                            : "0",
                        service_name: service.name,
                        service_description: features.showDescriptions
                            ? service.description
                            : undefined,
                        service_duration: features.showDuration
                            ? service.duration
                            : undefined,
                        comments:
                            formFields.comments.show && customerInfo.comments
                                ? customerInfo.comments.trim()
                                : undefined,
                        newsletter_opt_in: checkboxes.newsletter.show
                            ? customerInfo.newsletterAccepted
                            : false,
                        privacy_accepted: checkboxes.privacy.show
                            ? customerInfo.privacyAccepted
                            : true,
                        created_at: new Date().toISOString(),
                    },
                }

                debugLog(
                    "🔄 ATTEMPT 2: MERCHANT API (FALLBACK)",
                    merchantPayload
                )

                bookingResponse = await fetch(
                    `${apiConfig.baseUrl}/api/v1/companies/${apiConfig.organizationId}/bookings`,
                    {
                        method: "POST",
                        headers: {
                            "X-API-Key": apiConfig.apiKey,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(merchantPayload),
                    }
                )

                apiUsed = "Merchant API (fallback)"
            }

            // Check if booking was successful
            if (!bookingResponse.ok) {
                const errorText = await bookingResponse.text()
                debugLog("❌ ALL APIs FAILED", errorText)
                throw new Error(
                    `Booking error: ${bookingResponse.status} - ${errorText}`
                )
            }

            const bookingData = await bookingResponse.json()
            debugLog(`✅ Booking created with ${apiUsed}`, bookingData)

            // Extract booking information from response
            const bookingId =
                bookingData.id ||
                bookingData.bookingId ||
                bookingData.booking?.id
            const status =
                bookingData.status || bookingData.booking?.status || "pending"
            const paymentUrl =
                bookingData.paymentUrl ||
                bookingData.payment_url ||
                bookingData.checkout_url ||
                bookingData.url ||
                bookingData.data?.paymentUrl

            // Show success state
            setBookingSuccess({
                bookingId,
                status,
                paymentUrl,
                manualPayment: !paymentUrl,
                apiUsed,
            })

            // Auto-redirect to payment if URL is available
            if (paymentUrl) {
                debugLog(`💳 Payment URL: ${paymentUrl}`)
                setTimeout(() => {
                    debugLog("🚀 Redirecting to payment...")
                    window.open(paymentUrl, "_blank")
                }, 3000)
            }

            // Reset form state
            setShowBookingForm(false)
            setShowTimeSelection(false)
            setSelectedDate(null)
            setSelectedTimeSlot(null)
            setCustomerInfo({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                address: "",
                city: "",
                zipCode: "",
                company: "",
                comments: "",
                termsAccepted: false,
                privacyAccepted: false,
                newsletterAccepted: false,
            })
        } catch (error: any) {
            debugLog("❌ Critical error", error)
            alert(`Error: ${error.message}`)
        } finally {
            setIsBooking(false)
        }
    }

    /**
     * Utility Functions
     */
    const getCurrentService = () => {
        return activeServices.find(
            (service) => service.id === selectedServiceId
        )
    }

    const getAvailableDates = () => {
        return Object.keys(availableSlots).filter(
            (date) => availableSlots[date].length > 0
        )
    }

    /**
     * ERROR STATE: No Active Services
     * Display when no services are enabled or configured
     */
    if (activeServices.length === 0) {
        return (
            <div
                style={{
                    width: layout.width,
                    height: layout.height,
                    maxWidth: "100%",
                    backgroundColor: theme.backgroundColor,
                    borderRadius: `${theme.borderRadius}px`,
                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                    padding: `${layout.containerPadding}px`,
                    fontFamily: theme.fontFamily,
                    fontSize: `${theme.fontSize}px`,
                    color: theme.textColor,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    gap: `${layout.elementSpacing}px`,
                }}
            >
                <div style={{ fontSize: "48px" }}>⚠️</div>
                <h3
                    style={{ margin: 0, fontSize: `${theme.fontSize * 1.5}px` }}
                >
                    No Active Services
                </h3>
                <p style={{ margin: 0, color: `${theme.textColor}99` }}>
                    Please enable at least one service in the Framer properties
                    panel
                </p>
                <p
                    style={{
                        margin: 0,
                        fontSize: `${theme.fontSize * 0.9}px`,
                        color: `${theme.textColor}80`,
                    }}
                >
                    Services configured: {servicesCount} | Active services:{" "}
                    {activeServices.length}
                </p>
                <div
                    style={{
                        padding: `${layout.elementSpacing}px`,
                        backgroundColor: `${theme.secondaryColor}`,
                        borderRadius: `${theme.borderRadius}px`,
                        fontSize: `${theme.fontSize * 0.85}px`,
                        maxWidth: "400px",
                    }}
                >
                    <strong>Debug Info:</strong>
                    <br />
                    Services Count: {servicesCount}
                    <br />
                    Service 1 Enabled: {service1?.enabled?.toString()}
                    <br />
                    Service 2 Enabled: {service2?.enabled?.toString()}
                    <br />
                    Service 3 Enabled: {service3?.enabled?.toString()}
                </div>
            </div>
        )
    }

    /**
     * CALENDAR DAYS GENERATION
     * Creates the calendar grid with available/unavailable days
     */
    const generateCalendarDays = () => {
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
        const totalDaysInMonth = lastDayOfMonth.getDate()
        const startingWeekday = (firstDayOfMonth.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0

        const calendarDays = []

        // Add empty cells for days before month starts
        for (let emptyDay = 0; emptyDay < startingWeekday; emptyDay++) {
            calendarDays.push(
                <div
                    key={`empty-${emptyDay}`}
                    style={{ aspectRatio: "1" }}
                ></div>
            )
        }

        // Add days of the month
        for (let dayNumber = 1; dayNumber <= totalDaysInMonth; dayNumber++) {
            const currentDate = new Date(currentYear, currentMonth, dayNumber)
            const dateString = formatDateString(currentDate)
            const daySlots = availableSlots[dateString] || []
            const isDateAvailable = daySlots.length > 0
            const isCurrentDay =
                currentDate.toDateString() === today.toDateString()
            const isPastDate = currentDate < today

            // Style for each day cell
            let dayStyle: React.CSSProperties = {
                aspectRatio: "1",
                backgroundColor: isDateAvailable
                    ? "#dcfce7"
                    : theme.secondaryColor,
                borderRadius: `${theme.borderRadius * 0.75}px`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                cursor: isDateAvailable && !isPastDate ? "pointer" : "default",
                border: `2px solid ${isDateAvailable ? "#bbf7d0" : "transparent"}`,
                transition: "all 0.3s ease",
                opacity: isPastDate ? 0.3 : 1,
                fontFamily: theme.fontFamily,
                fontSize: `${theme.fontSize}px`,
                color: theme.textColor,
            }

            // Highlight current day
            if (isCurrentDay) {
                dayStyle.border = `2px solid ${theme.primaryColor}`
                dayStyle.backgroundColor = `${theme.primaryColor}20`
                dayStyle.fontWeight = "bold"
            }

            calendarDays.push(
                <div
                    key={`day-${dateString}`}
                    style={dayStyle}
                    onClick={() => {
                        if (isDateAvailable && !isPastDate) {
                            handleDateSelection(dateString)
                        }
                    }}
                >
                    <span style={{ fontWeight: "500" }}>{dayNumber}</span>
                    {/* Available indicator dot */}
                    {isDateAvailable && (
                        <div
                            style={{
                                width: "8px",
                                height: "8px",
                                backgroundColor: "#16a34a",
                                borderRadius: "50%",
                                marginTop: "4px",
                            }}
                        ></div>
                    )}
                    {/* Multiple slots indicator */}
                    {isDateAvailable && daySlots.length > 1 && (
                        <span
                            style={{
                                fontSize: `${theme.fontSize * 0.75}px`,
                                color: "#166534",
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

    /**
     * MAIN COMPONENT STYLES
     * Responsive container with configurable spacing
     */
    const containerStyle: React.CSSProperties = {
        width: layout.width,
        height: layout.enableScroll ? "auto" : layout.height,
        maxWidth: "100%",
        backgroundColor: theme.backgroundColor,
        borderRadius: `${theme.borderRadius}px`,
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
        padding: `${layout.containerPadding}px`,
        fontFamily: theme.fontFamily,
        fontSize: `${theme.fontSize}px`,
        color: theme.textColor,
        overflow: layout.enableScroll ? "visible" : "hidden",
        position: "relative",
        ...(layout.enableScroll && {
            maxHeight: "none",
            minHeight: layout.height,
        }),
    }

    const badgeStyle: React.CSSProperties = {
        position: "absolute",
        top: `${layout.elementSpacing}px`,
        right: `${layout.elementSpacing}px`,
        backgroundColor: "#1d4ed8",
        color: "white",
        padding: "8px 12px",
        borderRadius: `${theme.borderRadius * 0.5}px`,
        fontSize: `${theme.fontSize * 0.8}px`,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    }

    /**
     * MAIN COMPONENT RENDER
     * The complete calendar interface with all modals and interactions
     */
    return (
        <div style={containerStyle}>
            {/* CSS Animations */}
            <style>{`
                @keyframes spin-framer {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>

            {/* Services Count Badge */}
            <div style={badgeStyle}>
                {activeServices.length}/{servicesCount} Services
            </div>

            {/* Header Section */}
            <div
                style={{
                    textAlign: "center",
                    marginBottom: `${layout.sectionSpacing}px`,
                }}
            >
                {texts.showTitle && (
                    <h1
                        style={{
                            fontSize: `${theme.fontSize * 1.75}px`,
                            fontWeight: "700",
                            marginBottom: "8px",
                            lineHeight: "1.3",
                            margin: "0 0 8px 0",
                        }}
                    >
                        {texts.title}
                    </h1>
                )}
                {texts.showSubtitle && (
                    <p
                        style={{
                            fontSize: `${theme.fontSize * 1.1}px`,
                            color: `${theme.textColor}99`,
                            marginBottom: "0",
                            margin: "0",
                        }}
                    >
                        {texts.subtitle}
                    </p>
                )}
            </div>

            {/* Service Selection Section */}
            <div
                style={{
                    marginBottom: `${layout.sectionSpacing}px`,
                    textAlign: "center",
                }}
            >
                {texts.showServiceLabel && (
                    <label
                        style={{
                            display: "block",
                            marginBottom: `${layout.elementSpacing}px`,
                            fontWeight: "600",
                            fontSize: `${theme.fontSize * 1.1}px`,
                        }}
                    >
                        {texts.serviceLabel}
                    </label>
                )}
                <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    style={{
                        padding: `${layout.elementSpacing}px 20px`,
                        borderRadius: `${theme.borderRadius * 0.75}px`,
                        border: `2px solid ${theme.borderColor}`,
                        backgroundColor: theme.backgroundColor,
                        color: theme.textColor,
                        fontSize: `${theme.fontSize}px`,
                        fontFamily: theme.fontFamily,
                        width: "100%",
                        maxWidth: "400px",
                        cursor: "pointer",
                        outline: "none",
                    }}
                    disabled={loading}
                >
                    {activeServices.map((service) => (
                        <option key={service.id} value={service.id}>
                            {service.name}
                        </option>
                    ))}
                </select>

                {/* Service Details Display */}
                {getCurrentService() && (
                    <div
                        style={{
                            marginTop: `${layout.elementSpacing}px`,
                            padding: `${layout.elementSpacing}px`,
                            backgroundColor: theme.secondaryColor,
                            borderRadius: `${theme.borderRadius * 0.75}px`,
                            textAlign: "center",
                            maxWidth: "400px",
                            margin: `${layout.elementSpacing}px auto 0`,
                        }}
                    >
                        {features.showDescriptions &&
                            getCurrentService()!.description && (
                                <div
                                    style={{
                                        fontSize: `${theme.fontSize * 0.9}px`,
                                        color: `${theme.textColor}CC`,
                                        marginBottom: "8px",
                                    }}
                                >
                                    {getCurrentService()!.description}
                                </div>
                            )}

                        {features.showDuration &&
                            getCurrentService()!.duration && (
                                <div
                                    style={{
                                        fontSize: `${theme.fontSize * 0.85}px`,
                                        color: `${theme.textColor}99`,
                                        marginBottom: features.showPrices
                                            ? "8px"
                                            : "0",
                                    }}
                                >
                                    Duration: {getCurrentService()!.duration}
                                </div>
                            )}

                        {features.showPrices && (
                            <>
                                <div>
                                    <span>Price: </span>
                                    <span style={{ fontWeight: "600" }}>
                                        {getCurrentService()!.basePrice}€ +{" "}
                                        {getCurrentService()!.apaPrice}€ APA
                                    </span>
                                </div>
                                <div
                                    style={{
                                        fontSize: `${theme.fontSize * 1.25}px`,
                                        fontWeight: "700",
                                        color: theme.primaryColor,
                                        marginTop: "8px",
                                    }}
                                >
                                    Total:{" "}
                                    {getCurrentService()!.basePrice +
                                        getCurrentService()!.apaPrice}
                                    €
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Calendar Navigation */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: `${layout.sectionSpacing}px`,
                }}
            >
                <button
                    onClick={navigateToPreviousMonth}
                    style={{
                        backgroundColor: theme.secondaryColor,
                        border: "none",
                        borderRadius: `${theme.borderRadius * 0.75}px`,
                        fontSize: `${theme.fontSize * 1.5}px`,
                        fontWeight: "bold",
                        cursor: "pointer",
                        width: "48px",
                        height: "48px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: theme.textColor,
                        transition: "all 0.2s ease",
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
                        gap: `${layout.elementSpacing}px`,
                    }}
                >
                    <h2
                        style={{
                            fontSize: `${theme.fontSize * 1.5}px`,
                            fontWeight: "700",
                            textAlign: "center",
                            margin: "0",
                        }}
                    >
                        {MONTHS[currentMonth]} {currentYear}
                    </h2>
                    <button
                        onClick={returnToCurrentMonth}
                        style={{
                            backgroundColor: theme.primaryColor,
                            color: "white",
                            padding: "8px 16px",
                            borderRadius: `${theme.borderRadius * 0.75}px`,
                            fontWeight: "600",
                            cursor: "pointer",
                            border: "none",
                            transition: "all 0.2s ease",
                            fontSize: `${theme.fontSize}px`,
                            fontFamily: theme.fontFamily,
                        }}
                        disabled={loading}
                    >
                        {texts.todayButton}
                    </button>
                </div>

                <button
                    onClick={navigateToNextMonth}
                    style={{
                        backgroundColor: theme.secondaryColor,
                        border: "none",
                        borderRadius: `${theme.borderRadius * 0.75}px`,
                        fontSize: `${theme.fontSize * 1.5}px`,
                        fontWeight: "bold",
                        cursor: "pointer",
                        width: "48px",
                        height: "48px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: theme.textColor,
                        transition: "all 0.2s ease",
                    }}
                    disabled={loading}
                >
                    &#8250;
                </button>
            </div>

            {/* Calendar Weekday Headers */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: `${layout.calendarGap}px`,
                    marginBottom: `${layout.elementSpacing}px`,
                }}
            >
                {WEEKDAYS.map((weekday) => (
                    <div
                        key={weekday}
                        style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            padding: "8px 0",
                            fontSize: `${theme.fontSize * 0.9}px`,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                        }}
                    >
                        {weekday}
                    </div>
                ))}
            </div>

            {/* Main Calendar Grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: `${layout.calendarGap}px`,
                    minHeight: "350px",
                }}
            >
                {loading ? (
                    // Loading State
                    <div
                        style={{
                            gridColumn: "1 / -1",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "80px 0",
                            gap: "20px",
                        }}
                    >
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                border: `4px solid ${theme.secondaryColor}`,
                                borderTop: `4px solid ${theme.primaryColor}`,
                                borderRadius: "50%",
                                animation: "spin-framer 1s linear infinite",
                            }}
                        ></div>
                        <p
                            style={{
                                fontSize: `${theme.fontSize}px`,
                                fontWeight: "500",
                                margin: "0",
                            }}
                        >
                            {texts.loadingText}
                        </p>
                    </div>
                ) : error ? (
                    // Error State
                    <div
                        style={{
                            gridColumn: "1 / -1",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "80px 0",
                            gap: "20px",
                            textAlign: "center",
                        }}
                    >
                        <div style={{ fontSize: "48px" }}>⚠️</div>
                        <p
                            style={{
                                color: "#dc2626",
                                fontWeight: "600",
                                maxWidth: "384px",
                                margin: "0",
                                fontSize: `${theme.fontSize}px`,
                            }}
                        >
                            {error}
                        </p>
                        <button
                            onClick={forceReload}
                            style={{
                                backgroundColor: theme.primaryColor,
                                color: "white",
                                padding: "12px 24px",
                                borderRadius: `${theme.borderRadius * 0.75}px`,
                                fontWeight: "600",
                                cursor: "pointer",
                                border: "none",
                                fontSize: `${theme.fontSize}px`,
                                fontFamily: theme.fontFamily,
                            }}
                        >
                            {texts.errorRetryButton}
                        </button>
                    </div>
                ) : (
                    // Calendar Days
                    generateCalendarDays()
                )}
            </div>

            {/* SUCCESS MODAL */}
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
                        zIndex: 50,
                        padding: `${layout.elementSpacing}px`,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: theme.backgroundColor,
                            borderRadius: `${theme.borderRadius * 2}px`,
                            padding: `${layout.modalPadding}px`,
                            width: "100%",
                            maxWidth: "512px",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                        }}
                    >
                        <h3
                            style={{
                                fontSize: `${theme.fontSize * 1.5}px`,
                                fontWeight: "700",
                                textAlign: "center",
                                marginBottom: `${layout.elementSpacing}px`,
                                color: theme.primaryColor,
                                margin: `0 0 ${layout.elementSpacing}px 0`,
                            }}
                        >
                            {texts.successTitle}
                        </h3>

                        <div style={{ marginBottom: "24px" }}>
                            <div
                                style={{
                                    padding: `${layout.elementSpacing}px`,
                                    backgroundColor: `${theme.primaryColor}20`,
                                    borderRadius: `${theme.borderRadius}px`,
                                    border: `1px solid ${theme.primaryColor}40`,
                                }}
                            >
                                <p
                                    style={{
                                        margin: "0 0 8px 0",
                                        fontSize: `${theme.fontSize}px`,
                                    }}
                                >
                                    <strong>ID:</strong>{" "}
                                    {bookingSuccess.bookingId}
                                </p>
                                <p
                                    style={{
                                        margin: "0 0 8px 0",
                                        fontSize: `${theme.fontSize}px`,
                                    }}
                                >
                                    <strong>Status:</strong>{" "}
                                    {bookingSuccess.status} ✅
                                </p>
                                <p
                                    style={{
                                        margin: "0",
                                        fontSize: `${theme.fontSize * 0.9}px`,
                                        color: `${theme.textColor}80`,
                                    }}
                                >
                                    <strong>API Used:</strong>{" "}
                                    {bookingSuccess.apiUsed}
                                </p>
                            </div>

                            {bookingSuccess.paymentUrl ? (
                                <div
                                    style={{
                                        padding: `${layout.elementSpacing}px`,
                                        backgroundColor: "#dcfce7",
                                        borderRadius: `${theme.borderRadius}px`,
                                        border: "1px solid #bbf7d0",
                                        textAlign: "center",
                                        marginTop: `${layout.elementSpacing}px`,
                                    }}
                                >
                                    <p
                                        style={{
                                            color: "#166534",
                                            fontWeight: "600",
                                            margin: "0 0 8px 0",
                                            fontSize: `${theme.fontSize}px`,
                                        }}
                                    >
                                        {texts.paymentRedirectText}
                                    </p>
                                    <p
                                        style={{
                                            fontSize: `${theme.fontSize * 0.9}px`,
                                            color: "#166534",
                                            margin: "0",
                                        }}
                                    >
                                        Secure Bookla Payment
                                    </p>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        padding: `${layout.elementSpacing}px`,
                                        backgroundColor: "#fef3c7",
                                        borderRadius: `${theme.borderRadius}px`,
                                        border: "1px solid #fbbf24",
                                        textAlign: "center",
                                        marginTop: `${layout.elementSpacing}px`,
                                    }}
                                >
                                    <p
                                        style={{
                                            color: "#92400e",
                                            fontWeight: "600",
                                            margin: "0",
                                            fontSize: `${theme.fontSize}px`,
                                        }}
                                    >
                                        {texts.emailInstructionsText}
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setBookingSuccess(null)}
                            style={{
                                width: "100%",
                                backgroundColor: theme.primaryColor,
                                color: "white",
                                padding: "12px 24px",
                                borderRadius: `${theme.borderRadius}px`,
                                fontWeight: "600",
                                border: "none",
                                cursor: "pointer",
                                fontSize: `${theme.fontSize}px`,
                                fontFamily: theme.fontFamily,
                            }}
                        >
                            {texts.closeButton}
                        </button>
                    </div>
                </div>
            )}

            {/* TIME SELECTION MODAL */}
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
                        zIndex: 50,
                        padding: `${layout.elementSpacing}px`,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: theme.backgroundColor,
                            borderRadius: `${theme.borderRadius * 2}px`,
                            padding: `${layout.modalPadding}px`,
                            width: "100%",
                            maxWidth: "448px",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                        }}
                    >
                        <h3
                            style={{
                                fontSize: `${theme.fontSize * 1.25}px`,
                                fontWeight: "700",
                                textAlign: "center",
                                marginBottom: `${layout.elementSpacing}px`,
                                margin: `0 0 ${layout.elementSpacing}px 0`,
                            }}
                        >
                            {texts.chooseTimeTitle}
                        </h3>
                        <p
                            style={{
                                textAlign: "center",
                                marginBottom: "24px",
                                color: `${theme.textColor}99`,
                                margin: "0 0 24px 0",
                                fontSize: `${theme.fontSize}px`,
                            }}
                        >
                            Date: {selectedDate}
                        </p>

                        <div style={{ marginBottom: "24px" }}>
                            {(availableSlots[selectedDate] || []).map(
                                (slot, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            handleTimeSlotSelection(slot)
                                        }
                                        style={{
                                            width: "100%",
                                            padding: `${layout.elementSpacing}px`,
                                            border: `2px solid ${theme.borderColor}`,
                                            borderRadius: `${theme.borderRadius}px`,
                                            backgroundColor:
                                                theme.backgroundColor,
                                            cursor: "pointer",
                                            marginBottom: "12px",
                                            textAlign: "left",
                                            transition: "all 0.2s ease",
                                            fontSize: `${theme.fontSize}px`,
                                            fontFamily: theme.fontFamily,
                                        }}
                                    >
                                        <div style={{ fontWeight: "600" }}>
                                            {formatTimeString(slot.startTime)}
                                            {slot.endTime &&
                                                ` - ${formatTimeString(slot.endTime)}`}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: `${theme.fontSize * 0.9}px`,
                                                color: `${theme.textColor}99`,
                                            }}
                                        >
                                            {getCurrentService()?.name}
                                        </div>
                                    </button>
                                )
                            )}
                        </div>

                        <button
                            onClick={() => setShowTimeSelection(false)}
                            style={{
                                width: "100%",
                                padding: "12px",
                                backgroundColor: theme.secondaryColor,
                                color: theme.textColor,
                                borderRadius: `${theme.borderRadius}px`,
                                fontWeight: "600",
                                border: "none",
                                cursor: "pointer",
                                fontSize: `${theme.fontSize}px`,
                                fontFamily: theme.fontFamily,
                            }}
                        >
                            {texts.cancelButton}
                        </button>
                    </div>
                </div>
            )}

            {/* BOOKING FORM MODAL */}
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
                        zIndex: 50,
                        padding: `${layout.elementSpacing}px`,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: theme.backgroundColor,
                            borderRadius: `${theme.borderRadius * 2}px`,
                            padding: `${layout.modalPadding}px`,
                            width: "100%",
                            maxWidth: "512px",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                            maxHeight: "90vh",
                            overflowY: "auto",
                        }}
                    >
                        <h3
                            style={{
                                fontSize: `${theme.fontSize * 1.25}px`,
                                fontWeight: "700",
                                textAlign: "center",
                                marginBottom: `${layout.elementSpacing}px`,
                                margin: `0 0 ${layout.elementSpacing}px 0`,
                            }}
                        >
                            {texts.bookingTitle} - {getCurrentService()?.name}
                        </h3>
                        <p
                            style={{
                                textAlign: "center",
                                marginBottom: "8px",
                                color: `${theme.textColor}99`,
                                margin: "0 0 8px 0",
                                fontSize: `${theme.fontSize}px`,
                            }}
                        >
                            {selectedDate} at{" "}
                            {formatTimeString(selectedTimeSlot.startTime)}
                        </p>

                        <form
                            onSubmit={handleBookingSubmit}
                            style={{ marginTop: "24px" }}
                        >
                            {/* Dynamic Form Fields Generation */}
                            {Object.entries(formFields).map(
                                ([fieldName, fieldConfig]) => {
                                    if (!fieldConfig.show) return null

                                    const isTextarea = fieldName === "comments"
                                    const inputType =
                                        fieldName === "email"
                                            ? "email"
                                            : fieldName === "phone"
                                              ? "tel"
                                              : "text"

                                    return (
                                        <div
                                            key={fieldName}
                                            style={{
                                                marginBottom: `${layout.elementSpacing}px`,
                                            }}
                                        >
                                            <label
                                                style={{
                                                    display: "block",
                                                    fontWeight: "600",
                                                    marginBottom: "8px",
                                                    fontSize: `${theme.fontSize}px`,
                                                }}
                                            >
                                                {fieldConfig.label}{" "}
                                                {fieldConfig.required
                                                    ? "*"
                                                    : ""}
                                            </label>
                                            {isTextarea ? (
                                                <textarea
                                                    name={fieldName}
                                                    value={
                                                        customerInfo[
                                                            fieldName as keyof CustomerInfo
                                                        ] as string
                                                    }
                                                    onChange={
                                                        handleCustomerInfoChange
                                                    }
                                                    placeholder={
                                                        fieldConfig.placeholder
                                                    }
                                                    rows={3}
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px",
                                                        borderRadius: `${theme.borderRadius}px`,
                                                        border: `2px solid ${theme.borderColor}`,
                                                        fontSize: `${theme.fontSize}px`,
                                                        fontFamily:
                                                            theme.fontFamily,
                                                        outline: "none",
                                                        boxSizing: "border-box",
                                                        resize: "vertical",
                                                    }}
                                                    required={
                                                        fieldConfig.required
                                                    }
                                                />
                                            ) : (
                                                <input
                                                    type={inputType}
                                                    name={fieldName}
                                                    value={
                                                        customerInfo[
                                                            fieldName as keyof CustomerInfo
                                                        ] as string
                                                    }
                                                    onChange={
                                                        handleCustomerInfoChange
                                                    }
                                                    placeholder={
                                                        fieldConfig.placeholder
                                                    }
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px",
                                                        borderRadius: `${theme.borderRadius}px`,
                                                        border: `2px solid ${theme.borderColor}`,
                                                        fontSize: `${theme.fontSize}px`,
                                                        fontFamily:
                                                            theme.fontFamily,
                                                        outline: "none",
                                                        boxSizing: "border-box",
                                                    }}
                                                    required={
                                                        fieldConfig.required
                                                    }
                                                />
                                            )}
                                        </div>
                                    )
                                }
                            )}

                            {/* Dynamic Checkboxes */}
                            {(checkboxes.terms.show ||
                                checkboxes.privacy.show ||
                                checkboxes.newsletter.show) && (
                                <div
                                    style={{
                                        padding: `${layout.elementSpacing}px`,
                                        backgroundColor: theme.secondaryColor,
                                        border: `1px solid ${theme.borderColor}`,
                                        borderRadius: `${theme.borderRadius}px`,
                                        marginBottom: `${layout.elementSpacing}px`,
                                    }}
                                >
                                    {Object.entries(checkboxes).map(
                                        ([checkboxName, checkboxConfig]) => {
                                            if (!checkboxConfig.show)
                                                return null

                                            return (
                                                <label
                                                    key={checkboxName}
                                                    style={{
                                                        display: "flex",
                                                        alignItems:
                                                            "flex-start",
                                                        gap: "12px",
                                                        cursor: "pointer",
                                                        fontSize: `${theme.fontSize * 0.9}px`,
                                                        marginBottom: "12px",
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name={`${checkboxName}Accepted`}
                                                        checked={
                                                            customerInfo[
                                                                `${checkboxName}Accepted` as keyof CustomerInfo
                                                            ] as boolean
                                                        }
                                                        onChange={
                                                            handleCustomerInfoChange
                                                        }
                                                        style={{
                                                            width: "16px",
                                                            height: "16px",
                                                            cursor: "pointer",
                                                            marginTop: "2px",
                                                            flexShrink: 0,
                                                        }}
                                                        required={
                                                            checkboxConfig.required
                                                        }
                                                    />
                                                    <span>
                                                        {checkboxConfig.label}{" "}
                                                        {checkboxConfig.required
                                                            ? "*"
                                                            : ""}
                                                        {/* Add links for terms and privacy */}
                                                        {checkboxName ===
                                                            "terms" && (
                                                            <>
                                                                {" "}
                                                                <a
                                                                    href={
                                                                        urls.termsUrl
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    style={{
                                                                        color: theme.primaryColor,
                                                                        textDecoration:
                                                                            "underline",
                                                                    }}
                                                                >
                                                                    terms and
                                                                    conditions
                                                                </a>
                                                            </>
                                                        )}
                                                        {checkboxName ===
                                                            "privacy" && (
                                                            <>
                                                                {" "}
                                                                <a
                                                                    href={
                                                                        urls.privacyUrl
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    style={{
                                                                        color: theme.primaryColor,
                                                                        textDecoration:
                                                                            "underline",
                                                                    }}
                                                                >
                                                                    privacy
                                                                    policy
                                                                </a>
                                                            </>
                                                        )}
                                                    </span>
                                                </label>
                                            )
                                        }
                                    )}
                                </div>
                            )}

                            {/* Form Action Buttons */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: `${layout.elementSpacing}px`,
                                    paddingTop: `${layout.elementSpacing}px`,
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
                                        padding: "12px",
                                        backgroundColor: theme.secondaryColor,
                                        color: theme.textColor,
                                        fontWeight: "600",
                                        border: "none",
                                        borderRadius: `${theme.borderRadius}px`,
                                        cursor: "pointer",
                                        fontSize: `${theme.fontSize}px`,
                                        fontFamily: theme.fontFamily,
                                    }}
                                    disabled={isBooking}
                                >
                                    {texts.backButton}
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        flex: 2,
                                        padding: "12px",
                                        backgroundColor: theme.primaryColor,
                                        color: "white",
                                        fontWeight: "600",
                                        border: "none",
                                        borderRadius: `${theme.borderRadius}px`,
                                        cursor: "pointer",
                                        fontSize: `${theme.fontSize}px`,
                                        fontFamily: theme.fontFamily,
                                        opacity: isBooking ? 0.5 : 1,
                                    }}
                                    disabled={isBooking}
                                >
                                    {isBooking
                                        ? texts.bookingInProgress
                                        : texts.bookingButton}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Footer Section with Legend */}
            <div
                style={{
                    marginTop: `${layout.sectionSpacing}px`,
                    paddingTop: "24px",
                    borderTop: `1px solid ${theme.borderColor}`,
                    textAlign: "center",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: `${layout.sectionSpacing}px`,
                        marginBottom: `${layout.elementSpacing}px`,
                        flexWrap: "wrap",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                        }}
                    >
                        <div
                            style={{
                                width: "12px",
                                height: "12px",
                                backgroundColor: "#16a34a",
                                borderRadius: "50%",
                            }}
                        ></div>
                        <span style={{ fontSize: `${theme.fontSize * 0.9}px` }}>
                            {texts.availableLabel}
                        </span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                        }}
                    >
                        <div
                            style={{
                                width: "12px",
                                height: "12px",
                                backgroundColor: theme.primaryColor,
                                borderRadius: "50%",
                            }}
                        ></div>
                        <span style={{ fontSize: `${theme.fontSize * 0.9}px` }}>
                            Today
                        </span>
                    </div>
                </div>

                {!loading && !error && (
                    <p
                        style={{
                            fontWeight: "600",
                            marginBottom: `${layout.elementSpacing}px`,
                            margin: `0 0 ${layout.elementSpacing}px 0`,
                            fontSize: `${theme.fontSize}px`,
                        }}
                    >
                        {getAvailableDates().length} available day
                        {getAvailableDates().length !== 1 ? "s" : ""} for{" "}
                        {getCurrentService()?.name}
                    </p>
                )}

                {texts.showFooterText && (
                    <p
                        style={{
                            fontSize: `${theme.fontSize * 0.85}px`,
                            color: `${theme.textColor}99`,
                            margin: "0",
                        }}
                    >
                        {texts.footerText}
                    </p>
                )}
            </div>
        </div>
    )
}

/**
 * FRAMER PROPERTY CONTROLS CONFIGURATION
 * ====================================
 *
 * This configuration defines all the customizable properties in Framer.
 * Properties are organized into logical groups for better UX.
 *
 * IMPORTANT: Services are handled as individual props (service1, service2, etc.)
 * instead of nested objects due to Framer limitations.
 */

addPropertyControls(BooklaCalendarFramerComplete, {
    // === API CONFIGURATION GROUP ===
    apiConfig: {
        type: ControlType.Object,
        title: "🔧 API Configuration",
        controls: {
            organizationId: {
                type: ControlType.String,
                title: "Organization ID",
                defaultValue: "18566a74-b1ab-4345-948a-517f2ca10f09",
                description: "Your Bookla organization/company ID",
            },
            apiKey: {
                type: ControlType.String,
                title: "API Key",
                defaultValue: "teVkXn9d17cKZknCZopXDsEPz8SHs2Mf3E7r",
                description: "Your Bookla API key for authentication",
            },
            baseUrl: {
                type: ControlType.String,
                title: "Base URL",
                defaultValue: "https://us.bookla.com",
                description:
                    "Bookla API base URL (usually https://us.bookla.com)",
            },
            resourceId: {
                type: ControlType.String,
                title: "Resource ID",
                defaultValue: "8f653843-ae64-4d1a-9701-3a1ab12d133c",
                description: "Default resource ID for bookings",
            },
        },
    },

    // === TEXT CONFIGURATION GROUP ===
    texts: {
        type: ControlType.Object,
        title: "📝 Text Content",
        controls: {
            showTitle: {
                type: ControlType.Boolean,
                title: "Show Title",
                defaultValue: true,
            },
            title: {
                type: ControlType.String,
                title: "Main Title",
                defaultValue: "Réservation de Bateau",
            },
            showSubtitle: {
                type: ControlType.Boolean,
                title: "Show Subtitle",
                defaultValue: true,
            },
            subtitle: {
                type: ControlType.String,
                title: "Subtitle",
                defaultValue:
                    "Sélectionnez une date disponible pour réserver votre service",
            },
            showServiceLabel: {
                type: ControlType.Boolean,
                title: "Show Service Label",
                defaultValue: true,
            },
            serviceLabel: {
                type: ControlType.String,
                title: "Service Label",
                defaultValue: "Sélectionnez votre service :",
            },
            todayButton: {
                type: ControlType.String,
                title: "Today Button",
                defaultValue: "Aujourd'hui",
            },
            availableLabel: {
                type: ControlType.String,
                title: "Available Label",
                defaultValue: "Disponible",
            },
            loadingText: {
                type: ControlType.String,
                title: "Loading Text",
                defaultValue: "Chargement des disponibilités...",
            },
            errorRetryButton: {
                type: ControlType.String,
                title: "Retry Button",
                defaultValue: "Réessayer",
            },
            chooseTimeTitle: {
                type: ControlType.String,
                title: "Choose Time Title",
                defaultValue: "Choisissez un horaire",
            },
            bookingTitle: {
                type: ControlType.String,
                title: "Booking Title",
                defaultValue: "Réservation",
            },
            bookingButton: {
                type: ControlType.String,
                title: "Book Button",
                defaultValue: "Réserver",
            },
            bookingInProgress: {
                type: ControlType.String,
                title: "Booking in Progress",
                defaultValue: "Réservation...",
            },
            backButton: {
                type: ControlType.String,
                title: "Back Button",
                defaultValue: "Retour",
            },
            cancelButton: {
                type: ControlType.String,
                title: "Cancel Button",
                defaultValue: "Annuler",
            },
            closeButton: {
                type: ControlType.String,
                title: "Close Button",
                defaultValue: "Fermer",
            },
            successTitle: {
                type: ControlType.String,
                title: "Success Title",
                defaultValue: "🎉 Réservation créée !",
            },
            paymentRedirectText: {
                type: ControlType.String,
                title: "Payment Redirect Text",
                defaultValue: "🚀 Redirection vers le paiement...",
            },
            emailInstructionsText: {
                type: ControlType.String,
                title: "Email Instructions Text",
                defaultValue: "📧 Instructions envoyées par email",
            },
            showFooterText: {
                type: ControlType.Boolean,
                title: "Show Footer Text",
                defaultValue: true,
            },
            footerText: {
                type: ControlType.String,
                title: "Footer Text",
                defaultValue: "Paiement sécurisé 100% géré par Bookla",
            },
        },
    },

    // === URL CONFIGURATION GROUP ===
    urls: {
        type: ControlType.Object,
        title: "🔗 URLs",
        controls: {
            successUrl: {
                type: ControlType.String,
                title: "Success URL",
                defaultValue: "https://loupinedou-yacht.fr/confirmation-page",
                description: "Redirect URL after successful payment",
            },
            cancelUrl: {
                type: ControlType.String,
                title: "Cancel URL",
                defaultValue: "https://loupinedou-yacht.fr/error-page",
                description: "Redirect URL after cancelled payment",
            },
            termsUrl: {
                type: ControlType.String,
                title: "Terms URL",
                defaultValue: "https://loupinedou-yacht.fr/conditions",
                description: "Link to terms and conditions page",
            },
            privacyUrl: {
                type: ControlType.String,
                title: "Privacy URL",
                defaultValue: "https://loupinedou-yacht.fr/privacy",
                description: "Link to privacy policy page",
            },
        },
    },

    // === SERVICES CONFIGURATION ===
    servicesCount: {
        type: ControlType.Number,
        title: "🚢 Number of Services",
        defaultValue: 3,
        min: 1,
        max: 10,
        step: 1,
        description: "How many services to show (1-10)",
    },

    // Individual service controls (shown/hidden based on servicesCount)
    service1: {
        type: ControlType.Object,
        title: "Service 1",
        controls: {
            enabled: {
                type: ControlType.Boolean,
                title: "Enable",
                defaultValue: true,
            },
            id: {
                type: ControlType.String,
                title: "Service ID",
                defaultValue: "e7c09d8e-e012-4b82-8b31-d584fa4be8ae",
            },
            name: {
                type: ControlType.String,
                title: "Name",
                defaultValue: "Service Journée",
            },
            description: {
                type: ControlType.String,
                title: "Description",
                defaultValue: "Une journée complète de navigation",
            },
            basePrice: {
                type: ControlType.Number,
                title: "Base Price",
                defaultValue: 300,
                min: 0,
                step: 10,
            },
            apaPrice: {
                type: ControlType.Number,
                title: "APA Price",
                defaultValue: 100,
                min: 0,
                step: 10,
            },
            duration: {
                type: ControlType.String,
                title: "Duration",
                defaultValue: "8 heures",
            },
        },
    },
    service2: {
        type: ControlType.Object,
        title: "Service 2",
        hidden: (props: any) => (props.servicesCount || 3) < 2,
        controls: {
            enabled: {
                type: ControlType.Boolean,
                title: "Enable",
                defaultValue: true,
            },
            id: {
                type: ControlType.String,
                title: "Service ID",
                defaultValue: "1b994905-1980-4c7d-813a-66fcb8d88f92",
            },
            name: {
                type: ControlType.String,
                title: "Name",
                defaultValue: "Service Sunset",
            },
            description: {
                type: ControlType.String,
                title: "Description",
                defaultValue: "Navigation au coucher du soleil",
            },
            basePrice: {
                type: ControlType.Number,
                title: "Base Price",
                defaultValue: 200,
                min: 0,
                step: 10,
            },
            apaPrice: {
                type: ControlType.Number,
                title: "APA Price",
                defaultValue: 50,
                min: 0,
                step: 10,
            },
            duration: {
                type: ControlType.String,
                title: "Duration",
                defaultValue: "4 heures",
            },
        },
    },
    service3: {
        type: ControlType.Object,
        title: "Service 3",
        hidden: (props: any) => (props.servicesCount || 3) < 3,
        controls: {
            enabled: {
                type: ControlType.Boolean,
                title: "Enable",
                defaultValue: true,
            },
            id: {
                type: ControlType.String,
                title: "Service ID",
                defaultValue: "7c3ca43d-37b4-483e-b3f6-39e8aed4afe9",
            },
            name: {
                type: ControlType.String,
                title: "Name",
                defaultValue: "Service Mix",
            },
            description: {
                type: ControlType.String,
                title: "Description",
                defaultValue: "Formule personnalisée",
            },
            basePrice: {
                type: ControlType.Number,
                title: "Base Price",
                defaultValue: 350,
                min: 0,
                step: 10,
            },
            apaPrice: {
                type: ControlType.Number,
                title: "APA Price",
                defaultValue: 120,
                min: 0,
                step: 10,
            },
            duration: {
                type: ControlType.String,
                title: "Duration",
                defaultValue: "Sur mesure",
            },
        },
    },
    // Services 4-10 with similar structure...
    service4: {
        type: ControlType.Object,
        title: "Service 4",
        hidden: (props: any) => (props.servicesCount || 3) < 4,
        controls: {
            enabled: {
                type: ControlType.Boolean,
                title: "Enable",
                defaultValue: false,
            },
            id: {
                type: ControlType.String,
                title: "Service ID",
                defaultValue: "service-4-id",
            },
            name: {
                type: ControlType.String,
                title: "Name",
                defaultValue: "Service 4",
            },
            description: {
                type: ControlType.String,
                title: "Description",
                defaultValue: "Description du service 4",
            },
            basePrice: {
                type: ControlType.Number,
                title: "Base Price",
                defaultValue: 100,
                min: 0,
                step: 10,
            },
            apaPrice: {
                type: ControlType.Number,
                title: "APA Price",
                defaultValue: 50,
                min: 0,
                step: 10,
            },
            duration: {
                type: ControlType.String,
                title: "Duration",
                defaultValue: "2 heures",
            },
        },
    },
    service5: {
        type: ControlType.Object,
        title: "Service 5",
        hidden: (props: any) => (props.servicesCount || 3) < 5,
        controls: {
            enabled: {
                type: ControlType.Boolean,
                title: "Enable",
                defaultValue: false,
            },
            id: {
                type: ControlType.String,
                title: "Service ID",
                defaultValue: "service-5-id",
            },
            name: {
                type: ControlType.String,
                title: "Name",
                defaultValue: "Service 5",
            },
            description: {
                type: ControlType.String,
                title: "Description",
                defaultValue: "Description du service 5",
            },
            basePrice: {
                type: ControlType.Number,
                title: "Base Price",
                defaultValue: 100,
                min: 0,
                step: 10,
            },
            apaPrice: {
                type: ControlType.Number,
                title: "APA Price",
                defaultValue: 50,
                min: 0,
                step: 10,
            },
            duration: {
                type: ControlType.String,
                title: "Duration",
                defaultValue: "2 heures",
            },
        },
    },
    service6: {
        type: ControlType.Object,
        title: "Service 6",
        hidden: (props: any) => (props.servicesCount || 3) < 6,
        controls: {
            enabled: {
                type: ControlType.Boolean,
                title: "Enable",
                defaultValue: false,
            },
            id: {
                type: ControlType.String,
                title: "Service ID",
                defaultValue: "service-6-id",
            },
            name: {
                type: ControlType.String,
                title: "Name",
                defaultValue: "Service 6",
            },
            description: {
                type: ControlType.String,
                title: "Description",
                defaultValue: "Description du service 6",
            },
            basePrice: {
                type: ControlType.Number,
                title: "Base Price",
                defaultValue: 100,
                min: 0,
                step: 10,
            },
            apaPrice: {
                type: ControlType.Number,
                title: "APA Price",
                defaultValue: 50,
                min: 0,
                step: 10,
            },
            duration: {
                type: ControlType.String,
                title: "Duration",
                defaultValue: "2 heures",
            },
        },
    },
    service7: {
        type: ControlType.Object,
        title: "Service 7",
        hidden: (props: any) => (props.servicesCount || 3) < 7,
        controls: {
            enabled: {
                type: ControlType.Boolean,
                title: "Enable",
                defaultValue: false,
            },
            id: {
                type: ControlType.String,
                title: "Service ID",
                defaultValue: "service-7-id",
            },
            name: {
                type: ControlType.String,
                title: "Name",
                defaultValue: "Service 7",
            },
            description: {
                type: ControlType.String,
                title: "Description",
                defaultValue: "Description du service 7",
            },
            basePrice: {
                type: ControlType.Number,
                title: "Base Price",
                defaultValue: 100,
                min: 0,
                step: 10,
            },
            apaPrice: {
                type: ControlType.Number,
                title: "APA Price",
                defaultValue: 50,
                min: 0,
                step: 10,
            },
            duration: {
                type: ControlType.String,
                title: "Duration",
                defaultValue: "2 heures",
            },
        },
    },
    service8: {
        type: ControlType.Object,
        title: "Service 8",
        hidden: (props: any) => (props.servicesCount || 3) < 8,
        controls: {
            enabled: {
                type: ControlType.Boolean,
                title: "Enable",
                defaultValue: false,
            },
            id: {
                type: ControlType.String,
                title: "Service ID",
                defaultValue: "service-8-id",
            },
            name: {
                type: ControlType.String,
                title: "Name",
                defaultValue: "Service 8",
            },
            description: {
                type: ControlType.String,
                title: "Description",
                defaultValue: "Description du service 8",
            },
            basePrice: {
                type: ControlType.Number,
                title: "Base Price",
                defaultValue: 100,
                min: 0,
                step: 10,
            },
            apaPrice: {
                type: ControlType.Number,
                title: "APA Price",
                defaultValue: 50,
                min: 0,
                step: 10,
            },
            duration: {
                type: ControlType.String,
                title: "Duration",
                defaultValue: "2 heures",
            },
        },
    },
    service9: {
        type: ControlType.Object,
        title: "Service 9",
        hidden: (props: any) => (props.servicesCount || 3) < 9,
        controls: {
            enabled: {
                type: ControlType.Boolean,
                title: "Enable",
                defaultValue: false,
            },
            id: {
                type: ControlType.String,
                title: "Service ID",
                defaultValue: "service-9-id",
            },
            name: {
                type: ControlType.String,
                title: "Name",
                defaultValue: "Service 9",
            },
            description: {
                type: ControlType.String,
                title: "Description",
                defaultValue: "Description du service 9",
            },
            basePrice: {
                type: ControlType.Number,
                title: "Base Price",
                defaultValue: 100,
                min: 0,
                step: 10,
            },
            apaPrice: {
                type: ControlType.Number,
                title: "APA Price",
                defaultValue: 50,
                min: 0,
                step: 10,
            },
            duration: {
                type: ControlType.String,
                title: "Duration",
                defaultValue: "2 heures",
            },
        },
    },
    service10: {
        type: ControlType.Object,
        title: "Service 10",
        hidden: (props: any) => (props.servicesCount || 3) < 10,
        controls: {
            enabled: {
                type: ControlType.Boolean,
                title: "Enable",
                defaultValue: false,
            },
            id: {
                type: ControlType.String,
                title: "Service ID",
                defaultValue: "service-10-id",
            },
            name: {
                type: ControlType.String,
                title: "Name",
                defaultValue: "Service 10",
            },
            description: {
                type: ControlType.String,
                title: "Description",
                defaultValue: "Description du service 10",
            },
            basePrice: {
                type: ControlType.Number,
                title: "Base Price",
                defaultValue: 100,
                min: 0,
                step: 10,
            },
            apaPrice: {
                type: ControlType.Number,
                title: "APA Price",
                defaultValue: 50,
                min: 0,
                step: 10,
            },
            duration: {
                type: ControlType.String,
                title: "Duration",
                defaultValue: "2 heures",
            },
        },
    },

    // === FORM FIELDS CONFIGURATION ===
    formFields: {
        type: ControlType.Object,
        title: "📝 Form Fields",
        controls: {
            firstName: {
                type: ControlType.Object,
                title: "First Name",
                controls: {
                    show: {
                        type: ControlType.Boolean,
                        title: "Show",
                        defaultValue: true,
                    },
                    required: {
                        type: ControlType.Boolean,
                        title: "Required",
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
                title: "Last Name",
                controls: {
                    show: {
                        type: ControlType.Boolean,
                        title: "Show",
                        defaultValue: true,
                    },
                    required: {
                        type: ControlType.Boolean,
                        title: "Required",
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
                    show: {
                        type: ControlType.Boolean,
                        title: "Show",
                        defaultValue: true,
                    },
                    required: {
                        type: ControlType.Boolean,
                        title: "Required",
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
                title: "Phone",
                controls: {
                    show: {
                        type: ControlType.Boolean,
                        title: "Show",
                        defaultValue: true,
                    },
                    required: {
                        type: ControlType.Boolean,
                        title: "Required",
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
                        defaultValue: "0123456789",
                    },
                },
            },
            address: {
                type: ControlType.Object,
                title: "Address",
                controls: {
                    show: {
                        type: ControlType.Boolean,
                        title: "Show",
                        defaultValue: false,
                    },
                    required: {
                        type: ControlType.Boolean,
                        title: "Required",
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
            city: {
                type: ControlType.Object,
                title: "City",
                controls: {
                    show: {
                        type: ControlType.Boolean,
                        title: "Show",
                        defaultValue: false,
                    },
                    required: {
                        type: ControlType.Boolean,
                        title: "Required",
                        defaultValue: false,
                    },
                    label: {
                        type: ControlType.String,
                        title: "Label",
                        defaultValue: "Ville",
                    },
                    placeholder: {
                        type: ControlType.String,
                        title: "Placeholder",
                        defaultValue: "Votre ville",
                    },
                },
            },
            zipCode: {
                type: ControlType.Object,
                title: "Zip Code",
                controls: {
                    show: {
                        type: ControlType.Boolean,
                        title: "Show",
                        defaultValue: false,
                    },
                    required: {
                        type: ControlType.Boolean,
                        title: "Required",
                        defaultValue: false,
                    },
                    label: {
                        type: ControlType.String,
                        title: "Label",
                        defaultValue: "Code postal",
                    },
                    placeholder: {
                        type: ControlType.String,
                        title: "Placeholder",
                        defaultValue: "12345",
                    },
                },
            },
            company: {
                type: ControlType.Object,
                title: "Company",
                controls: {
                    show: {
                        type: ControlType.Boolean,
                        title: "Show",
                        defaultValue: false,
                    },
                    required: {
                        type: ControlType.Boolean,
                        title: "Required",
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
            comments: {
                type: ControlType.Object,
                title: "Comments",
                controls: {
                    show: {
                        type: ControlType.Boolean,
                        title: "Show",
                        defaultValue: false,
                    },
                    required: {
                        type: ControlType.Boolean,
                        title: "Required",
                        defaultValue: false,
                    },
                    label: {
                        type: ControlType.String,
                        title: "Label",
                        defaultValue: "Commentaires",
                    },
                    placeholder: {
                        type: ControlType.String,
                        title: "Placeholder",
                        defaultValue: "Vos commentaires...",
                    },
                },
            },
        },
    },

    // === CHECKBOXES CONFIGURATION ===
    checkboxes: {
        type: ControlType.Object,
        title: "☑️ Checkboxes",
        controls: {
            terms: {
                type: ControlType.Object,
                title: "Terms & Conditions",
                controls: {
                    show: {
                        type: ControlType.Boolean,
                        title: "Show",
                        defaultValue: true,
                    },
                    required: {
                        type: ControlType.Boolean,
                        title: "Required",
                        defaultValue: true,
                    },
                    label: {
                        type: ControlType.String,
                        title: "Label",
                        defaultValue: "J'accepte les conditions générales",
                    },
                },
            },
            privacy: {
                type: ControlType.Object,
                title: "Privacy Policy",
                controls: {
                    show: {
                        type: ControlType.Boolean,
                        title: "Show",
                        defaultValue: false,
                    },
                    required: {
                        type: ControlType.Boolean,
                        title: "Required",
                        defaultValue: false,
                    },
                    label: {
                        type: ControlType.String,
                        title: "Label",
                        defaultValue:
                            "J'accepte la politique de confidentialité",
                    },
                },
            },
            newsletter: {
                type: ControlType.Object,
                title: "Newsletter",
                controls: {
                    show: {
                        type: ControlType.Boolean,
                        title: "Show",
                        defaultValue: false,
                    },
                    required: {
                        type: ControlType.Boolean,
                        title: "Required",
                        defaultValue: false,
                    },
                    label: {
                        type: ControlType.String,
                        title: "Label",
                        defaultValue: "Je souhaite recevoir la newsletter",
                    },
                },
            },
        },
    },

    // === THEME CONFIGURATION ===
    theme: {
        type: ControlType.Object,
        title: "🎨 Theme",
        controls: {
            primaryColor: {
                type: ControlType.Color,
                title: "Primary Color",
                defaultValue: "#16a34a",
            },
            secondaryColor: {
                type: ControlType.Color,
                title: "Secondary Color",
                defaultValue: "#f1f5f9",
            },
            backgroundColor: {
                type: ControlType.Color,
                title: "Background",
                defaultValue: "#ffffff",
            },
            textColor: {
                type: ControlType.Color,
                title: "Text Color",
                defaultValue: "#374151",
            },
            borderColor: {
                type: ControlType.Color,
                title: "Border Color",
                defaultValue: "#e2e8f0",
            },
            fontFamily: {
                type: ControlType.String,
                title: "Font Family",
                defaultValue:
                    "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            },
            fontSize: {
                type: ControlType.Number,
                title: "Font Size",
                defaultValue: 16,
                min: 12,
                max: 24,
                step: 1,
            },
            borderRadius: {
                type: ControlType.Number,
                title: "Border Radius",
                defaultValue: 12,
                min: 0,
                max: 30,
                step: 1,
            },
        },
    },

    // === LAYOUT CONFIGURATION ===
    layout: {
        type: ControlType.Object,
        title: "📐 Layout & Spacing",
        controls: {
            width: {
                type: ControlType.Number,
                title: "Width",
                defaultValue: 800,
                min: 300,
                max: 1200,
                step: 50,
            },
            height: {
                type: ControlType.Number,
                title: "Height",
                defaultValue: 900,
                min: 400,
                max: 1200,
                step: 50,
            },
            enableScroll: {
                type: ControlType.Boolean,
                title: "Enable Scroll",
                defaultValue: true,
                description: "Allow scrolling when content overflows",
            },
            containerPadding: {
                type: ControlType.Number,
                title: "Container Padding",
                defaultValue: 32,
                min: 8,
                max: 80,
                step: 4,
            },
            sectionSpacing: {
                type: ControlType.Number,
                title: "Section Spacing",
                defaultValue: 32,
                min: 8,
                max: 80,
                step: 4,
            },
            elementSpacing: {
                type: ControlType.Number,
                title: "Element Spacing",
                defaultValue: 16,
                min: 4,
                max: 40,
                step: 2,
            },
            calendarGap: {
                type: ControlType.Number,
                title: "Calendar Gap",
                defaultValue: 8,
                min: 2,
                max: 20,
                step: 2,
            },
            modalPadding: {
                type: ControlType.Number,
                title: "Modal Padding",
                defaultValue: 32,
                min: 8,
                max: 80,
                step: 4,
            },
        },
    },

    // === FEATURES CONFIGURATION ===
    features: {
        type: ControlType.Object,
        title: "⚙️ Features",
        controls: {
            showPrices: {
                type: ControlType.Boolean,
                title: "Show Prices",
                defaultValue: true,
                description: "Display service prices in the UI",
            },
            showDescriptions: {
                type: ControlType.Boolean,
                title: "Show Descriptions",
                defaultValue: true,
                description: "Display service descriptions",
            },
            showDuration: {
                type: ControlType.Boolean,
                title: "Show Duration",
                defaultValue: true,
                description: "Display service duration",
            },
            debugMode: {
                type: ControlType.Boolean,
                title: "Debug Mode",
                defaultValue: false,
                description: "Enable console logging for debugging",
            },
        },
    },
})

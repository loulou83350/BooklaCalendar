import * as React from "react";

// === CONFIGURATION BOOKLA ===
const ORGANIZATION_ID = "18566a74-b1ab-4345-948a-517f2ca10f09";
const API_KEY = "teVkXn9d17cKZknCZopXDsEPz8SHs2Mf3E7r";
const BASE_URL = "https://us.bookla.com";
const RESOURCE_ID = "8f653843-ae64-4d1a-9701-3a1ab12d133c";

// Services de location de bateau avec prix
const SERVICES = [
  { 
    id: "e7c09d8e-e012-4b82-8b31-d584fa4be8ae", 
    name: "Service Journée",
    basePrice: 300,
    apaPrice: 100
  },
  { 
    id: "1b994905-1980-4c7d-813a-66fcb8d88f92", 
    name: "Service Sunset", 
    basePrice: 200,
    apaPrice: 50
  },
  { 
    id: "7c3ca43d-37b4-483e-b3f6-39e8aed4afe9", 
    name: "Service Mix",
    basePrice: 350,
    apaPrice: 120
  }
];

// Constantes pour le calendrier français
const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

// Fonction utilitaire pour formater les dates
function formatDateString(date) {
  return date.toISOString().split("T")[0];
}

// Styles CSS
const styles = {
  calendarContainer: {
    maxWidth: '650px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    padding: '30px',
    fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif"
  },
  serviceSelectionSection: {
    marginBottom: '25px',
    textAlign: 'center'
  },
  serviceLabel: {
    display: 'block',
    marginBottom: '10px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151'
  },
  serviceDropdown: {
    padding: '14px 18px',
    borderRadius: '12px',
    border: '2px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    fontSize: '16px',
    fontWeight: '500',
    width: '100%',
    maxWidth: '350px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none'
  },
  navigationHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '25px'
  },
  navigationButton: {
    backgroundColor: '#f3f4f6',
    border: 'none',
    borderRadius: '12px',
    fontSize: '28px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#374151',
    transition: 'all 0.2s ease'
  },
  monthDisplaySection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px'
  },
  monthTitle: {
    margin: '0',
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center'
  },
  todayButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '6px 16px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  weekdayHeaders: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '8px',
    marginBottom: '15px'
  },
  weekdayCell: {
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '700',
    color: '#6b7280',
    padding: '10px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '8px',
    minHeight: '350px'
  },
  emptyDayCell: {
    backgroundColor: 'transparent'
  },
  dayCell: {
    aspectRatio: '1',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.3s ease'
  },
  dayNumber: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151'
  },
  availableDay: {
    backgroundColor: '#dcfce7',
    borderColor: '#16a34a'
  },
  currentDay: {
    borderColor: '#2563eb',
    backgroundColor: '#dbeafe',
    fontWeight: '800'
  },
  pastDay: {
    opacity: '0.3',
    cursor: 'not-allowed'
  },
  availabilityIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#16a34a',
    marginTop: '6px'
  },
  loadingState: {
    gridColumn: 'span 7',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 0',
    gap: '20px'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    color: '#6b7280',
    fontSize: '16px',
    fontWeight: '500',
    margin: '0'
  },
  errorState: {
    gridColumn: 'span 7',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    gap: '20px',
    textAlign: 'center'
  },
  errorIcon: {
    fontSize: '48px'
  },
  errorText: {
    color: '#dc2626',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0',
    maxWidth: '400px'
  },
  retryButton: {
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  footerSection: {
    marginTop: '30px',
    paddingTop: '25px',
    borderTop: '2px solid #e5e7eb'
  },
  legendContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    marginBottom: '15px'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280'
  },
  availabilityDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#16a34a'
  },
  todayDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#2563eb'
  },
  summaryInfo: {
    textAlign: 'center'
  },
  summaryText: {
    fontSize: '15px',
    color: '#6b7280',
    fontWeight: '600',
    margin: '0'
  },
  priceContainer: {
    marginTop: '15px',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    textAlign: 'center'
  },
  priceLabel: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#6b7280'
  },
  priceValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 5px'
  },
  totalPrice: {
    display: 'block',
    marginTop: '8px',
    fontSize: '20px',
    fontWeight: '800',
    color: '#16a34a'
  },
  bookingFormOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  bookingFormContainer: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '30px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
  },
  bookingFormTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    marginTop: 0,
    marginBottom: '5px',
    textAlign: 'center'
  },
  bookingFormDate: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '20px',
    textAlign: 'center'
  },
  bookingForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  formLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  formInput: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%'
  },
  priceDisplayContainer: {
    marginTop: '10px',
    padding: '15px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  },
  priceDisplayTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginTop: 0,
    marginBottom: '10px',
    textAlign: 'center'
  },
  termsContainer: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  },
  termsLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: '#4b5563'
  },
  termsCheckbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
  termsLink: {
    color: '#2563eb',
    textDecoration: 'underline',
    cursor: 'pointer'
  },
  formActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
    gap: '15px'
  },
  cancelButton: {
    padding: '12px 20px',
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: '1'
  },
  submitButton: {
    padding: '12px 20px',
    backgroundColor: '#16a34a',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: '2'
  },
  paymentRedirectInfo: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#e0f2fe',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '16px'
  }
};

// Composant principal du calendrier
export default function BooklaCalendar() {
  const today = new Date();
  const [currentYear, setCurrentYear] = React.useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = React.useState(today.getMonth());
  const [selectedServiceId, setSelectedServiceId] = React.useState(SERVICES[0].id);
  const [availableDates, setAvailableDates] = React.useState([]);
  const [availableSlots, setAvailableSlots] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  
  // États pour la réservation
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [showBookingForm, setShowBookingForm] = React.useState(false);
  const [customerInfo, setCustomerInfo] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    termsAccepted: false
  });
  const [bookingSuccess, setBookingSuccess] = React.useState(false);
  const [paymentUrl, setPaymentUrl] = React.useState("");
  const [bookingId, setBookingId] = React.useState("");

  // Hook pour récupérer les disponibilités depuis l'API Bookla
  React.useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Utilisation de Date.UTC pour garantir le fuseau horaire UTC
        const startOfMonth = new Date(Date.UTC(currentYear, currentMonth, 1));
        const endOfMonth = new Date(Date.UTC(currentYear, currentMonth + 1, 0, 23, 59, 59));
        
        const fromDate = startOfMonth.toISOString();
        const toDate = endOfMonth.toISOString();
        
        // URL pour les disponibilités
        const apiUrl = `${BASE_URL}/api/v1/companies/${ORGANIZATION_ID}/services/${selectedServiceId}/times`;
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'X-API-Key': API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: fromDate,
            to: toDate,
            spots: 1
          })
        });

        if (!response.ok) {
          throw new Error(`Erreur API Bookla: ${response.status}`);
        }

        const apiData = await response.json();
        const availableDatesSet = new Set();
        const slotsByDate = {};
        
        if (apiData && apiData.times) {
          // Traitement des créneaux disponibles pour notre ressource
          const resourceSlots = apiData.times[RESOURCE_ID] || [];
          
          resourceSlots.forEach((slot) => {
            if (slot.startTime) {
              const slotDate = slot.startTime.split('T')[0];
              availableDatesSet.add(slotDate);
              
              if (!slotsByDate[slotDate]) {
                slotsByDate[slotDate] = [];
              }
              slotsByDate[slotDate].push(slot.startTime);
            }
          });
        }
        
        setAvailableDates(Array.from(availableDatesSet));
        setAvailableSlots(slotsByDate);
      } catch (err) {
        console.error('Erreur lors du chargement des disponibilités:', err);
        setError(err.message || "Impossible de charger les disponibilités");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [currentYear, currentMonth, selectedServiceId]);

  // Fonctions de navigation
  const navigateToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(prev => prev - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const navigateToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(prev => prev + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const returnToCurrentMonth = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };
  
  // Fonction pour sélectionner une date
  const handleDateSelection = (dateString) => {
    setSelectedDate(dateString);
    setShowBookingForm(true);
  };
  
  // Fonction pour gérer les changements dans le formulaire client
  const handleCustomerInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Fonction corrigée pour gérer la réservation avec l'ID de ressource
  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!customerInfo.termsAccepted) {
      alert("Vous devez accepter les conditions générales pour continuer");
      return;
    }
    
    try {
      // Vérifier qu'il y a des créneaux disponibles pour cette date
      if (!availableSlots[selectedDate] || availableSlots[selectedDate].length === 0) {
        throw new Error("Aucun créneau disponible pour cette date");
      }
      
      // Prendre le premier créneau disponible de la journée
      const startTime = availableSlots[selectedDate][0];
      
      // Endpoint pour la réservation avec l'ID de ressource fourni
      const bookingResponse = await fetch(
        `${BASE_URL}/api/v1/companies/${ORGANIZATION_ID}/bookings`,
        {
          method: 'POST',
          headers: {
            'X-API-Key': API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            serviceId: selectedServiceId,
            resourceId: RESOURCE_ID,
            startTime: startTime, // Utiliser le créneau exact de l'API
            spots: 1,
            customer: {
              firstName: customerInfo.firstName,
              lastName: customerInfo.lastName,
              email: customerInfo.email,
              phone: customerInfo.phone
            },
            termsAccepted: customerInfo.termsAccepted
          })
        }
      );
      
      // Gestion améliorée des erreurs
      if (!bookingResponse.ok) {
        const errorBody = await bookingResponse.text();
        console.error("Détails de l'erreur:", errorBody);
        
        let errorMessage = "Erreur lors de la création de la réservation";
        try {
          const errorData = JSON.parse(errorBody);
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          console.error("Erreur de parsing de la réponse", e);
        }
        throw new Error(errorMessage);
      }
      
      const bookingData = await bookingResponse.json();
      console.log("Réponse complète de la réservation:", bookingData);
      
      // Vérification du format de réponse - NOUVELLE STRUCTURE DE L'API
      let paymentUrl = "";
      let bookingId = "";
      
      if (bookingData.paymentUrl) {
        paymentUrl = bookingData.paymentUrl;
      } else if (bookingData.booking?.paymentUrl) {
        paymentUrl = bookingData.booking.paymentUrl;
      } else if (bookingData.data?.paymentUrl) {
        paymentUrl = bookingData.data.paymentUrl;
      }
      
      if (bookingData.bookingId) {
        bookingId = bookingData.bookingId;
      } else if (bookingData.booking?.id) {
        bookingId = bookingData.booking.id;
      }
      
      // Si nous avons l'URL de paiement, procéder à la redirection
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } 
      // Sinon, afficher l'information de succès avec les détails
      else if (bookingId) {
        setBookingSuccess(true);
        setPaymentUrl(`${BASE_URL}/booking/${bookingId}/payment`);
        setBookingId(bookingId);
      } else {
        throw new Error("URL de paiement non disponible dans la réponse");
      }
    } catch (error) {
      console.error("Erreur de réservation:", error);
      alert(`Une erreur est survenue lors de la réservation: ${error.message}`);
    }
  };

  // Fonction pour générer les jours du calendrier
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const totalDaysInMonth = lastDayOfMonth.getDate();
    const startingWeekday = (firstDayOfMonth.getDay() + 6) % 7; // Lundi = 0
    
    const calendarDays = [];
    
    // Cellules vides pour les jours avant le début du mois
    for (let emptyDay = 0; emptyDay < startingWeekday; emptyDay++) {
      calendarDays.push(
        <div key={`empty-${emptyDay}`} style={styles.emptyDayCell}></div>
      );
    }
    
    // Cellules pour chaque jour du mois
    for (let dayNumber = 1; dayNumber <= totalDaysInMonth; dayNumber++) {
      const currentDate = new Date(currentYear, currentMonth, dayNumber);
      const dateString = formatDateString(currentDate);
      const isDateAvailable = availableDates.includes(dateString);
      const isCurrentDay = currentDate.toDateString() === today.toDateString();
      const isPastDate = currentDate < today;
      
      let dayStyles = { ...styles.dayCell };
      
      if (isDateAvailable) {
        dayStyles = { ...dayStyles, ...styles.availableDay };
      }
      
      if (isCurrentDay) {
        dayStyles = { ...dayStyles, ...styles.currentDay };
      }
      
      if (isPastDate) {
        dayStyles = { ...dayStyles, ...styles.pastDay };
      }

      calendarDays.push(
        <div 
          key={`day-${dateString}`} 
          style={dayStyles}
          onClick={() => {
            if (isDateAvailable && !isPastDate) {
              handleDateSelection(dateString);
            }
          }}
        >
          <span style={styles.dayNumber}>{dayNumber}</span>
          {isDateAvailable && <div style={styles.availabilityIndicator}></div>}
        </div>
      );
    }
    
    return calendarDays;
  };
  
  // Fonction pour afficher le prix du service
  const displayServicePrice = () => {
    const selectedService = SERVICES.find(service => service.id === selectedServiceId);
    if (!selectedService) return null;
    
    const basePrice = selectedService.basePrice;
    const apaPrice = selectedService.apaPrice;
    const totalPrice = basePrice + apaPrice;
    
    return (
      <div style={styles.priceContainer}>
        <span style={styles.priceLabel}>Prix: </span>
        <span style={styles.priceValue}>{basePrice}€ + {apaPrice}€ d'APA</span>
        <span style={styles.totalPrice}>Total: {totalPrice}€</span>
      </div>
    );
  };
  
  // Obtenir le nom du service actuellement sélectionné
  const getCurrentServiceName = () => {
    const selectedService = SERVICES.find(service => service.id === selectedServiceId);
    return selectedService ? selectedService.name : "Service";
  };

  // Rendu du composant principal
  return (
    <div style={styles.calendarContainer}>
      {/* Section de sélection du service */}
      <div style={styles.serviceSelectionSection}>
        <label style={styles.serviceLabel}>Sélectionnez votre service :</label>
        <select 
          value={selectedServiceId} 
          onChange={(event) => setSelectedServiceId(event.target.value)}
          style={styles.serviceDropdown}
          disabled={loading}
        >
          {SERVICES.map(service => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
        {displayServicePrice()}
      </div>

      {/* En-tête de navigation du calendrier */}
      <div style={styles.navigationHeader}>
        <button 
          onClick={navigateToPreviousMonth} 
          style={styles.navigationButton}
          disabled={loading}
        >
          &#8249;
        </button>
        
        <div style={styles.monthDisplaySection}>
          <h2 style={styles.monthTitle}>
            {MONTHS[currentMonth]} {currentYear}
          </h2>
          <button 
            onClick={returnToCurrentMonth} 
            style={styles.todayButton}
            disabled={loading}
          >
            Aujourd'hui
          </button>
        </div>
        
        <button 
          onClick={navigateToNextMonth} 
          style={styles.navigationButton}
          disabled={loading}
        >
          &#8250;
        </button>
      </div>

      {/* En-têtes des jours de la semaine */}
      <div style={styles.weekdayHeaders}>
        {WEEKDAYS.map(weekday => (
          <div key={weekday} style={styles.weekdayCell}>
            {weekday}
          </div>
        ))}
      </div>

      {/* Grille principale du calendrier */}
      <div style={styles.calendarGrid}>
        {loading ? (
          <div style={styles.loadingState}>
            <div style={styles.loadingSpinner}></div>
            <p style={styles.loadingText}>Chargement des disponibilités...</p>
          </div>
        ) : error ? (
          <div style={styles.errorState}>
            <div style={styles.errorIcon}>⚠️</div>
            <p style={styles.errorText}>{error}</p>
            <button 
              onClick={() => {
                setCurrentMonth(prev => prev); // Force le rechargement
              }} 
              style={styles.retryButton}
            >
              Réessayer
            </button>
          </div>
        ) : (
          generateCalendarDays()
        )}
      </div>

      {/* Formulaire de réservation */}
      {showBookingForm && selectedDate && !bookingSuccess && (
        <div style={styles.bookingFormOverlay}>
          <div style={styles.bookingFormContainer}>
            <h3 style={styles.bookingFormTitle}>Réservation pour {getCurrentServiceName()}</h3>
            <p style={styles.bookingFormDate}>Date: {selectedDate}</p>
            
            <form onSubmit={handleBooking} style={styles.bookingForm}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  value={customerInfo.firstName}
                  onChange={handleCustomerInfoChange}
                  style={styles.formInput}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Nom</label>
                <input
                  type="text"
                  name="lastName"
                  value={customerInfo.lastName}
                  onChange={handleCustomerInfoChange}
                  style={styles.formInput}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleCustomerInfoChange}
                  style={styles.formInput}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleCustomerInfoChange}
                  style={styles.formInput}
                  required
                />
              </div>
              
              <div style={styles.priceDisplayContainer}>
                <h4 style={styles.priceDisplayTitle}>Récapitulatif</h4>
                {displayServicePrice()}
              </div>
              
              <div style={styles.termsContainer}>
                <label style={styles.termsLabel}>
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={customerInfo.termsAccepted}
                    onChange={handleCustomerInfoChange}
                    style={styles.termsCheckbox}
                    required
                  />
                  J'accepte les <a href="#" style={styles.termsLink}>conditions générales</a>
                </label>
              </div>
              
              <div style={styles.formActions}>
                <button 
                  type="button" 
                  onClick={() => setShowBookingForm(false)}
                  style={styles.cancelButton}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  style={styles.submitButton}
                >
                  Réserver et Payer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Message de succès après réservation */}
      {showBookingForm && selectedDate && bookingSuccess && (
        <div style={styles.bookingFormOverlay}>
          <div style={styles.bookingFormContainer}>
            <h3 style={styles.bookingFormTitle}>Réservation confirmée !</h3>
            <p style={styles.bookingFormDate}>Date: {selectedDate}</p>
            
            <div style={styles.paymentRedirectInfo}>
              <p>Votre réservation a été créée avec succès (ID: {bookingId})</p>
              <p>Cliquez sur le bouton ci-dessous pour procéder au paiement</p>
              
              <div style={{ marginTop: '20px' }}>
                <a 
                  href={paymentUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.submitButton}
                >
                  Accéder au paiement
                </a>
              </div>
              
              <p style={{ marginTop: '15px', fontSize: '14px' }}>
                Vous serez redirigé vers la page de paiement sécurisé de Bookla
              </p>
            </div>
            
            <div style={styles.formActions}>
              <button 
                type="button" 
                onClick={() => {
                  setShowBookingForm(false);
                  setBookingSuccess(false);
                }}
                style={styles.cancelButton}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section d'informations et légende */}
      <div style={styles.footerSection}>
        <div style={styles.legendContainer}>
          <div style={styles.legendItem}>
            <div style={styles.availabilityDot}></div>
            <span>Disponible</span>
          </div>
          <div style={styles.legendItem}>
            <div style={styles.todayDot}></div>
            <span>Aujourd'hui</span>
          </div>
        </div>
        
        {!loading && !error && !showBookingForm && (
          <div style={styles.summaryInfo}>
            <p style={styles.summaryText}>
              {availableDates.length} jour{availableDates.length !== 1 ? 's' : ''} 
              disponible{availableDates.length !== 1 ? 's' : ''} pour {getCurrentServiceName()}
            </p>
          </div>
        )}
      </div>
      
      {/* Animation CSS pour le spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

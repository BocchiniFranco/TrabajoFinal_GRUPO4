export function isCarAvailable(car, checkDate = new Date()) {
    if (!car.rentals || car.rentals.length === 0) return true;
    
    const currentDate = new Date(checkDate);
    
    // Buscar si hay algún alquiler activo en la fecha consultada
    const activeRental = car.rentals.find(rental => {
      const start = new Date(rental.startDate);
      const end = new Date(rental.endDate);
      return currentDate >= start && currentDate <= end && rental.status === 'active';
    });
    
    return !activeRental;
  }
  
  export function getNextAvailableDate(car) {
    if (!car.rentals || car.rentals.length === 0) return new Date();
    
    const futureRentals = car.rentals
      .filter(rental => new Date(rental.endDate) >= new Date())
      .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
    
    return futureRentals.length > 0 
      ? new Date(futureRentals[futureRentals.length - 1].endDate)
      : new Date();
  }
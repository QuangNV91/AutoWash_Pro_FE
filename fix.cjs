const fs = require('fs');
let path = 'c:/Users/WIN10/IdeaProjects/SWP391_SU26_AutoWashPro_BE/src/main/java/com/autowashpro/service/BookService.java';
let f = fs.readFileSync(path, 'utf8');

// replace 1
f = f.replace('.bookingId(booking.getId())\r\n                .vehicleId(vehicle.getId())', 
`.bookingId(booking.getId())
                .customerId(booking.getCustomer() != null ? booking.getCustomer().getId() : null)
                .customerName(booking.getCustomer() != null ? booking.getCustomer().getFullName() : null)
                .vehicleId(vehicle.getId())`);
f = f.replace('.bookingId(booking.getId())\n                .vehicleId(vehicle.getId())', 
`.bookingId(booking.getId())
                .customerId(booking.getCustomer() != null ? booking.getCustomer().getId() : null)
                .customerName(booking.getCustomer() != null ? booking.getCustomer().getFullName() : null)
                .vehicleId(vehicle.getId())`);

// replace 2
f = f.replace('.serviceName(service.getServiceName())\r\n                .bookingDate(booking.getBookingDate())', 
`.serviceName(service.getServiceName())
                .staffId(booking.getStaff() != null ? booking.getStaff().getId() : null)
                .staffName(booking.getStaff() != null ? booking.getStaff().getFullName() : null)
                .bookingDate(booking.getBookingDate())`);
f = f.replace('.serviceName(service.getServiceName())\n                .bookingDate(booking.getBookingDate())', 
`.serviceName(service.getServiceName())
                .staffId(booking.getStaff() != null ? booking.getStaff().getId() : null)
                .staffName(booking.getStaff() != null ? booking.getStaff().getFullName() : null)
                .bookingDate(booking.getBookingDate())`);

fs.writeFileSync(path, f);
console.log('done');

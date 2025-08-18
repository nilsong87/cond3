// resident.js
$(document).ready(function() {
    // Toggle sidebar on mobile
    $('.sidebar-toggle').click(function() {
        $('.app-sidebar').toggleClass('active');
    });
    
    // Toggle password visibility
    $('.toggle-password').click(function() {
        const input = $(this).siblings('input');
        const icon = $(this).find('i');
        if (input.attr('type') === 'password') {
            input.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            input.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });
    
    // Switch between content sections
    $('.sidebar-menu a').click(function(e) {
        e.preventDefault();
        const target = $(this).attr('href').substring(1);
        
        $('.sidebar-menu li').removeClass('active');
        $(this).parent().addClass('active');
        
        $('.content-section').removeClass('active');
        $(`#${target}-section`).addClass('active');
        
        $('.header-title').text($(this).text());
        
        // Close sidebar on mobile
        if ($(window).width() < 992) {
            $('.app-sidebar').removeClass('active');
        }
    });
    
    // Initialize resident calendar
    const residentCalendarEl = document.getElementById('resident-calendar');
    if (residentCalendarEl) {
        const residentCalendar = new FullCalendar.Calendar(residentCalendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            events: [
                {
                    title: 'Reserva - Churrasqueira',
                    start: '2023-06-17T15:00:00',
                    end: '2023-06-17T18:00:00',
                    backgroundColor: '#4cc9f0',
                    borderColor: '#4cc9f0'
                },
                {
                    title: 'Reserva - Salão de Festas',
                    start: '2023-06-25T19:00:00',
                    end: '2023-06-25T23:00:00',
                    backgroundColor: '#4895ef',
                    borderColor: '#4895ef'
                }
            ],
            eventClick: function(info) {
                alert('Evento: ' + info.event.title);
            }
        });
        residentCalendar.render();
    }
    
    // Initialize reservation calendar
    const reservationCalendarEl = document.getElementById('reservation-calendar');
    if (reservationCalendarEl) {
        const reservationCalendar = new FullCalendar.Calendar(reservationCalendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            events: [
                {
                    title: 'Churrasqueira - Apto 102',
                    start: '2023-06-17T15:00:00',
                    end: '2023-06-17T18:00:00',
                    backgroundColor: '#4cc9f0',
                    borderColor: '#4cc9f0'
                },
                {
                    title: 'Salão de Festas - Apto 305',
                    start: '2023-06-25T19:00:00',
                    end: '2023-06-25T23:00:00',
                    backgroundColor: '#4895ef',
                    borderColor: '#4895ef'
                },
                {
                    title: 'Quadra - Apto 201',
                    start: '2023-06-20T09:00:00',
                    end: '2023-06-20T11:00:00',
                    backgroundColor: '#4361ee',
                    borderColor: '#4361ee'
                }
            ],
            eventClick: function(info) {
                alert('Reserva: ' + info.event.title);
            }
        });
        reservationCalendar.render();
    }
    
    // QR Code buttons
    $('.btn-outline-primary').click(function() {
        if ($(this).find('i').hasClass('fa-qrcode')) {
            $('#qrCodeModal').modal('show');
        }
    });
    
    // Form submissions
    $('#newPackageForm, #newReservationForm, #newOccurrenceForm, #newLostItemForm, #newVisitorForm').submit(function(e) {
        e.preventDefault();
        // Here you would typically send the form data to the server
        // For this example, we'll just show a success message
        const formName = $(this).attr('id').replace('Form', '').replace(/([A-Z])/g, ' $1').trim();
        alert(`${formName} submitted successfully!`);
        $(this).closest('.modal').modal('hide');
        $(this).trigger('reset');
    });
    
    // Copy PIX code
    $('#copyPixButton').click(function() {
        const pixCode = $(this).siblings('input').val();
        navigator.clipboard.writeText(pixCode).then(function() {
            alert('Código PIX copiado para a área de transferência!');
        });
    });
    
    // Simulate PWA installation
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('sw.js').then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }
});

// admin.js
$(document).ready(function() {
    // Toggle sidebar on mobile
    $('.sidebar-toggle').click(function() {
        $('.app-sidebar').toggleClass('active');
    });
    
    // Switch between content sections
    $('.sidebar-menu a').click(function(e) {
        e.preventDefault();
        const target = $(this).attr('href').substring(1);
        
        $('.sidebar-menu li').removeClass('active');
        $(this).parent().addClass('active');
        
        $('.content-section').removeClass('active');
        $(`#${target}-section`).addClass('active');
        
        $('.header-title').text($(this).text());
        
        // Close sidebar on mobile
        if ($(window).width() < 992) {
            $('.app-sidebar').removeClass('active');
        }
    });
    
    // Initialize DataTables
    $('#packagesTable, #reservationsTable, #occurrencesTable, #votingTable, #visitorsTable, #residentsTable').DataTable({
        responsive: true,
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/pt-BR.json'
        }
    });
    
    // Initialize admin calendar
    const adminCalendarEl = document.getElementById('admin-reservation-calendar');
    if (adminCalendarEl) {
        const adminCalendar = new FullCalendar.Calendar(adminCalendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            events: [
                {
                    title: 'Churrasqueira - Apto 102',
                    start: '2023-06-17T15:00:00',
                    end: '2023-06-17T18:00:00',
                    backgroundColor: '#4cc9f0',
                    borderColor: '#4cc9f0'
                },
                {
                    title: 'Salão de Festas - Apto 305',
                    start: '2023-06-25T19:00:00',
                    end: '2023-06-25T23:00:00',
                    backgroundColor: '#4895ef',
                    borderColor: '#4895ef'
                },
                {
                    title: 'Quadra - Apto 201',
                    start: '2023-06-20T09:00:00',
                    end: '2023-06-20T11:00:00',
                    backgroundColor: '#4361ee',
                    borderColor: '#4361ee'
                },
                {
                    title: 'Sala de Jogos - Apto 410',
                    start: '2023-06-18T14:00:00',
                    end: '2023-06-18T16:00:00',
                    backgroundColor: '#3f37c9',
                    borderColor: '#3f37c9'
                }
            ],
            eventClick: function(info) {
                alert('Reserva: ' + info.event.title);
            }
        });
        adminCalendar.render();
    }
    
    // Initialize charts
    const activitiesCtx = document.getElementById('activitiesChart');
    if (activitiesCtx) {
        new Chart(activitiesCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [
                    {
                        label: 'Encomendas',
                        data: [120, 145, 132, 158, 167, 185],
                        borderColor: '#4361ee',
                        backgroundColor: 'rgba(67, 97, 238, 0.1)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Reservas',
                        data: [45, 52, 48, 60, 58, 65],
                        borderColor: '#4cc9f0',
                        backgroundColor: 'rgba(76, 201, 240, 0.1)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Ocorrências',
                        data: [28, 35, 30, 42, 38, 45],
                        borderColor: '#f8961e',
                        backgroundColor: 'rgba(248, 150, 30, 0.1)',
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    const occurrencesCtx = document.getElementById('occurrencesChart');
    if (occurrencesCtx) {
        new Chart(occurrencesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Pendentes', 'Em Andamento', 'Resolvidas'],
                datasets: [{
                    data: [15, 8, 32],
                    backgroundColor: [
                        '#f8961e',
                        '#4895ef',
                        '#4cc9f0'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });
    }
    
    // QR Code buttons
    $('.btn-outline-primary').click(function() {
        if ($(this).find('i').hasClass('fa-qrcode')) {
            $('#adminQrCodeModal').modal('show');
        }
    });
    
    // Copy code button
    $('#adminCopyCodeButton').click(function() {
        const code = $(this).siblings('input').val();
        navigator.clipboard.writeText(code).then(function() {
            alert('Código copiado para a área de transferência!');
        });
    });
    
    // Form submissions
    $('form[id$="Form"]').submit(function(e) {
        e.preventDefault();
        // Here you would typically send the form data to the server
        // For this example, we'll just show a success message
        const formName = $(this).attr('id').replace('Form', '').replace(/([A-Z])/g, ' $1').trim();
        alert(`${formName} submitted successfully!`);
        $(this).closest('.modal').modal('hide');
        $(this).trigger('reset');
    });
    
    // Switch between settings tabs
    $('#settingsTab button').click(function(e) {
        e.preventDefault();
        $(this).tab('show');
    });
});
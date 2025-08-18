$(document).ready(function() {
    // Menu Hamburguer - Versão corrigida
    const sidebarToggle = $('#sidebarToggle');
    const appSidebar = $('.app-sidebar');
    const sidebarOverlay = $('<div class="sidebar-overlay"></div>');
    
    // Adiciona overlay ao body
    $('body').append(sidebarOverlay);
    
    // Toggle sidebar
    sidebarToggle.on('click', function(e) {
        e.stopPropagation();
        appSidebar.toggleClass('active');
        sidebarOverlay.toggleClass('active');
        $('body').toggleClass('no-scroll');
    });
    
    // Fechar sidebar ao clicar no overlay
    sidebarOverlay.on('click', function() {
        appSidebar.removeClass('active');
        sidebarOverlay.removeClass('active');
        $('body').removeClass('no-scroll');
    });
    
    // Toggle password visibility
    $('.toggle-password').on('click', function() {
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
    $('.sidebar-menu a').on('click', function(e) {
        e.preventDefault();
        const target = $(this).attr('href').substring(1);
        
        $('.sidebar-menu li').removeClass('active');
        $(this).parent().addClass('active');
        
        $('.content-section').removeClass('active');
        $(`#${target}-section`).addClass('active');
        
        $('.header-title').text($(this).text().trim());
        
        // Close sidebar on mobile
        if ($(window).width() < 992) {
            appSidebar.removeClass('active');
            sidebarOverlay.removeClass('active');
            $('body').removeClass('no-scroll');
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
                    start: new Date(),
                    end: new Date(new Date().setHours(new Date().getHours() + 3)),
                    backgroundColor: '#4cc9f0',
                    borderColor: '#4cc9f0'
                },
                {
                    title: 'Reserva - Salão de Festas',
                    start: new Date(new Date().setDate(new Date().getDate() + 7)),
                    end: new Date(new Date().setDate(new Date().getDate() + 7) + 4 * 60 * 60 * 1000),
                    backgroundColor: '#4895ef',
                    borderColor: '#4895ef'
                }
            ],
            eventClick: function(info) {
                $('#eventModal .modal-title').text(info.event.title);
                $('#eventModal .modal-body').html(`
                    <p><strong>Início:</strong> ${info.event.start.toLocaleString()}</p>
                    <p><strong>Término:</strong> ${info.event.end ? info.event.end.toLocaleString() : 'Não definido'}</p>
                `);
                $('#eventModal').modal('show');
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
                    start: new Date(),
                    end: new Date(new Date().setHours(new Date().getHours() + 3)),
                    backgroundColor: '#4cc9f0',
                    borderColor: '#4cc9f0'
                },
                {
                    title: 'Salão de Festas - Apto 305',
                    start: new Date(new Date().setDate(new Date().getDate() + 7)),
                    end: new Date(new Date().setDate(new Date().getDate() + 7) + 4 * 60 * 60 * 1000),
                    backgroundColor: '#4895ef',
                    borderColor: '#4895ef'
                }
            ],
            eventClick: function(info) {
                $('#eventModal .modal-title').text(info.event.title);
                $('#eventModal .modal-body').html(`
                    <p><strong>Início:</strong> ${info.event.start.toLocaleString()}</p>
                    <p><strong>Término:</strong> ${info.event.end ? info.event.end.toLocaleString() : 'Não definido'}</p>
                `);
                $('#eventModal').modal('show');
            }
        });
        reservationCalendar.render();
    }
    
    // QR Code buttons
    $(document).on('click', '.btn-outline-primary', function() {
        if ($(this).find('i').hasClass('fa-qrcode')) {
            $('#qrCodeModal').modal('show');
        }
    });
    
    // Form submissions
    $('#newPackageForm, #newReservationForm, #newOccurrenceForm, #newLostItemForm, #newVisitorForm').on('submit', function(e) {
        e.preventDefault();
        const formName = $(this).attr('id').replace('Form', '').replace(/([A-Z])/g, ' $1').trim();
        
        // Simular envio assíncrono
        const submitBtn = $(this).find('[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Processando...');
        
        setTimeout(() => {
            alert(`${formName} enviado com sucesso!`);
            $(this).closest('.modal').modal('hide');
            $(this).trigger('reset');
            submitBtn.prop('disabled', false).html(originalText);
        }, 1500);
    });
    
    // Copy PIX code
    $('#copyPixButton').on('click', function() {
        const pixCode = $(this).siblings('input').val();
        navigator.clipboard.writeText(pixCode).then(function() {
            const originalText = $('#copyPixButton').html();
            $('#copyPixButton').html('<i class="fas fa-check"></i> Copiado!');
            setTimeout(() => {
                $('#copyPixButton').html(originalText);
            }, 2000);
        });
    });
    
    // Service Worker for PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('sw.js').then(function(registration) {
                console.log('ServiceWorker registrado com sucesso: ', registration.scope);
            }, function(err) {
                console.log('Falha no registro do ServiceWorker: ', err);
            });
        });
    }
    
    // Fechar menu ao clicar fora em telas pequenas
    $(window).on('resize', function() {
        if ($(window).width() >= 992) {
            appSidebar.removeClass('active');
            sidebarOverlay.removeClass('active');
            $('body').removeClass('no-scroll');
        }
    });
});
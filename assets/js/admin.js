$(document).ready(function() {
    // Verifica se FullCalendar está disponível
    if (typeof FullCalendar === 'undefined') {
        console.error('FullCalendar não está carregado corretamente');
        return;
    }

    // Constantes para elementos do DOM
    const $sidebarToggle = $('#sidebarToggle');
    const $appSidebar = $('.app-sidebar');
    const $sidebarOverlay = $('<div class="sidebar-overlay"></div>').appendTo('body');
    const $body = $('body');
    const $window = $(window);

    // ==============================================
    // FUNÇÕES AUXILIARES
    // ==============================================

    /**
     * Alterna a visibilidade da sidebar
     */
    function toggleSidebar() {
        $appSidebar.toggleClass('active');
        $sidebarOverlay.toggleClass('active');
        $body.toggleClass('no-scroll');
    }

    /**
     * Fecha a sidebar
     */
    function closeSidebar() {
        $appSidebar.removeClass('active');
        $sidebarOverlay.removeClass('active');
        $body.removeClass('no-scroll');
    }

    /**
     * Alterna a visibilidade da senha
     * @param {jQuery} $button - Botão de toggle
     */
    function togglePasswordVisibility($button) {
        const $input = $button.siblings('input');
        const $icon = $button.find('i');
        
        if ($input.attr('type') === 'password') {
            $input.attr('type', 'text');
            $icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            $input.attr('type', 'password');
            $icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    }

    /**
     * Muda a seção de conteúdo exibida
     * @param {jQuery} $link - Link do menu clicado
     */
    function switchContentSection($link) {
        const target = $link.attr('href').substring(1);
        
        $('.sidebar-menu li').removeClass('active');
        $link.parent().addClass('active');
        
        $('.content-section').removeClass('active');
        $(`#${target}-section`).addClass('active');
        
        $('.header-title').text($link.text().trim());
        
        // Fecha sidebar em dispositivos móveis
        if ($window.width() < 992) {
            closeSidebar();
        }
    }

    /**
     * Inicializa um calendário FullCalendar
     * @param {string} elementId - ID do elemento do calendário
     * @param {Array} events - Array de eventos
     * @returns {Calendar} Instância do calendário
     */
    function initCalendar(elementId, events) {
        const calendarEl = document.getElementById(elementId);
        if (!calendarEl) return null;

        try {
            const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                events: events,
                locale: 'pt-br',
                buttonText: {
                    today: 'Hoje',
                    month: 'Mês',
                    week: 'Semana',
                    day: 'Dia'
                },
                eventClick: function(info) {
                    showEventModal(info.event);
                }
            });
            
            calendar.render();
            return calendar;
        } catch (error) {
            console.error('Erro ao inicializar o calendário:', error);
            return null;
        }
    }

    /**
     * Mostra modal com detalhes do evento
     * @param {Object} event - Objeto do evento
     */
    function showEventModal(event) {
        const startDate = event.start ? event.start.toLocaleString('pt-BR') : 'Não definido';
        const endDate = event.end ? event.end.toLocaleString('pt-BR') : 'Não definido';
        
        $('#eventModal .modal-title').text(event.title);
        $('#eventModal .modal-body').html(`
            <p><strong>Início:</strong> ${startDate}</p>
            <p><strong>Término:</strong> ${endDate}</p>
            ${event.extendedProps?.description ? `<p><strong>Descrição:</strong> ${event.extendedProps.description}</p>` : ''}
        `);
        $('#eventModal').modal('show');
    }

    /**
     * Simula o envio de um formulário
     * @param {jQuery} $form - Formulário jQuery
     */
    function simulateFormSubmission($form) {
        const formName = $form.attr('id').replace('Form', '').replace(/([A-Z])/g, ' $1').trim();
        const $submitBtn = $form.find('[type="submit"]');
        const originalText = $submitBtn.html();
        
        $submitBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Processando...');
        
        setTimeout(() => {
            // Aqui seria o sucesso do AJAX
            alert(`${formName} enviado com sucesso!`);
            $form.closest('.modal').modal('hide');
            $form.trigger('reset');
            $submitBtn.prop('disabled', false).html(originalText);
        }, 1500);
    }

    // ==============================================
    // INICIALIZAÇÃO DOS COMPONENTES
    // ==============================================

    // Menu Hamburguer
    $sidebarToggle.on('click', function(e) {
        e.stopPropagation();
        toggleSidebar();
    });
    
    // Fechar sidebar ao clicar no overlay
    $sidebarOverlay.on('click', closeSidebar);
    
    // Alternar visibilidade da senha
    $('.toggle-password').on('click', function() {
        togglePasswordVisibility($(this));
    });
    
    // Alternar entre seções de conteúdo
    $('.sidebar-menu a').on('click', function(e) {
        e.preventDefault();
        switchContentSection($(this));
    });

    // Inicializar calendários
    const residentEvents = [
        {
            title: 'Reserva - Churrasqueira',
            start: new Date(),
            end: new Date(new Date().setHours(new Date().getHours() + 3)),
            backgroundColor: '#4cc9f0',
            borderColor: '#4cc9f0',
            description: 'Reserva para churrasco em família'
        },
        {
            title: 'Reserva - Salão de Festas',
            start: new Date(new Date().setDate(new Date().getDate() + 7)),
            end: new Date(new Date().setDate(new Date().getDate() + 7) + 4 * 60 * 60 * 1000),
            backgroundColor: '#4895ef',
            borderColor: '#4895ef',
            description: 'Festa de aniversário'
        }
    ];

    const reservationEvents = [
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
    ];

    initCalendar('resident-calendar', residentEvents);
    initCalendar('reservation-calendar', reservationEvents);

    // Botões QR Code
    $(document).on('click', '.btn-outline-primary', function() {
        if ($(this).find('i').hasClass('fa-qrcode')) {
            $('#qrCodeModal').modal('show');
        }
    });
    
    // Submissão de formulários
    $('#newPackageForm, #newReservationForm, #newOccurrenceForm, #newLostItemForm, #newVisitorForm').on('submit', function(e) {
        e.preventDefault();
        simulateFormSubmission($(this));
    });
    
    // Copiar código PIX
    $('#copyPixButton').on('click', function() {
        const pixCode = $(this).siblings('input').val();
        navigator.clipboard.writeText(pixCode).then(function() {
            const $button = $('#copyPixButton');
            const originalText = $button.html();
            
            $button.html('<i class="fas fa-check"></i> Copiado!');
            setTimeout(() => {
                $button.html(originalText);
            }, 2000);
        }).catch(err => {
            console.error('Falha ao copiar texto: ', err);
            alert('Não foi possível copiar o código PIX');
        });
    });
    
    // Fechar menu ao redimensionar para telas maiores
    $window.on('resize', function() {
        if ($window.width() >= 992) {
            closeSidebar();
        }
    });

    $(document).ready(function() {
    // Elementos do DOM
    const $sidebarToggle = $('.sidebar-toggle');
    const $appSidebar = $('.app-sidebar');
    const $sidebarOverlay = $('<div class="sidebar-overlay"></div>').appendTo('body');
    const $body = $('body');

    // Função para abrir/fechar o menu
    function toggleSidebar() {
        $appSidebar.toggleClass('active');
        $sidebarOverlay.toggleClass('active');
        $body.toggleClass('no-scroll');
    }

    // Função para fechar o menu
    function closeSidebar() {
        $appSidebar.removeClass('active');
        $sidebarOverlay.removeClass('active');
        $body.removeClass('no-scroll');
    }

    // Evento de clique no botão hamburguer
    $sidebarToggle.on('click', function(e) {
        e.stopPropagation();
        toggleSidebar();
    });

    // Fechar ao clicar no overlay
    $sidebarOverlay.on('click', closeSidebar);

    // Fechar ao clicar em um link do menu (para mobile)
    $('.sidebar-menu a').on('click', function() {
        if ($(window).width() < 992) {
            closeSidebar();
        }
    });

    // Fechar ao redimensionar para telas maiores
    $(window).on('resize', function() {
        if ($(window).width() >= 992) {
            closeSidebar();
        }
    });

});
});

    // ==============================================
    // FUNCIONALIDADES DO SISTEMA
    // ==============================================

    // Alternar visibilidade da senha
    $('.toggle-password').on('click', function() {
        const $input = $(this).siblings('input');
        const $icon = $(this).find('i');
        $input.attr('type', $input.attr('type') === 'password' ? 'text' : 'password');
        $icon.toggleClass('fa-eye fa-eye-slash');
    });

    // Alternar entre seções de conteúdo APENAS para links que começam com #
    $('.sidebar-menu a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this).attr('href').substring(1);
        
        $('.sidebar-menu li').removeClass('active');
        $(this).parent().addClass('active');
        
        $('.content-section').removeClass('active');
        $(`#${target}-section`).addClass('active');
        
        $('.header-title').text($(this).text().trim());
    });

    // Para links que não começam com #, permitir o comportamento padrão
    $('.sidebar-menu a').not('[href^="#"]').on('click', function() {
        // Apenas fecha a sidebar em mobile
        if ($window.width() < 992) {
            closeSidebar();
        }
        // O navegador seguirá o link normalmente
    });

    // Restante do seu código permanece o mesmo...
    // Inicializar calendários
    function initCalendar(elementId, events) {
        const calendarEl = document.getElementById(elementId);
        if (!calendarEl || typeof FullCalendar === 'undefined') return null;

        try {
            const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                events: events,
                locale: 'pt-br',
                eventClick: function(info) {
                    const start = info.event.start ? info.event.start.toLocaleString('pt-BR') : 'Não definido';
                    const end = info.event.end ? info.event.end.toLocaleString('pt-BR') : 'Não definido';
                    
                    $('#eventModal .modal-title').text(info.event.title);
                    $('#eventModal .modal-body').html(`
                        <p><strong>Início:</strong> ${start}</p>
                        <p><strong>Término:</strong> ${end}</p>
                    `);
                    $('#eventModal').modal('show');
                }
            });
            calendar.render();
            return calendar;
        } catch (error) {
            console.error('Erro ao inicializar calendário:', error);
            return null;
        }
    }

    // Calendário do morador
    initCalendar('resident-calendar', [
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
    ]);

    // Calendário de reservas
    initCalendar('reservation-calendar', [
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
    ]);

    // Botões QR Code
    $(document).on('click', '.btn-outline-primary', function() {
        if ($(this).find('i').hasClass('fa-qrcode')) {
            $('#qrCodeModal').modal('show');
        }
    });
    
    // Submissão de formulários
    $('form[id$="Form"]').on('submit', function(e) {
        e.preventDefault();
        const $form = $(this);
        const formName = $form.attr('id').replace('Form', '').replace(/([A-Z])/g, ' $1').trim();
        const $submitBtn = $form.find('[type="submit"]');
        const originalText = $submitBtn.html();
        
        $submitBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Processando...');
        
        setTimeout(() => {
            alert(`${formName} enviado com sucesso!`);
            $form.closest('.modal').modal('hide');
            $form.trigger('reset');
            $submitBtn.prop('disabled', false).html(originalText);
        }, 1500);
    });
    
    // Copiar código PIX
    $('#copyPixButton').on('click', function() {
        const pixCode = $(this).siblings('input').val();
        navigator.clipboard.writeText(pixCode).then(() => {
            const $button = $(this);
            const originalText = $button.html();
            $button.html('<i class="fas fa-check"></i> Copiado!');
            setTimeout(() => $button.html(originalText), 2000);
        }).catch(err => {
            console.error('Falha ao copiar:', err);
            alert('Não foi possível copiar o código');
        });
    });
    
    // Service Worker para PWA
    if ('serviceWorker' in navigator) {
        $(window).on('load', function() {
            navigator.serviceWorker.register('js/sw.js').then(registration => {
                console.log('ServiceWorker registrado:', registration.scope);
            }).catch(err => {
                console.error('Falha no ServiceWorker:', err);
            });
        });
    }

    // ==============================================
    // INICIALIZAÇÃO DE PLUGINS (ADMIN)
    // ==============================================
    
    // DataTables
    if ($.fn.DataTable) {
        $('#packagesTable, #residentsTable, #visitorsTable').DataTable();
    }

    // Gráficos (Chart.js)
    if (typeof Chart !== 'undefined') {
        const ctx = document.getElementById('activitiesChart')?.getContext('2d');
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    datasets: [{
                        label: 'Atividades',
                        data: [12, 19, 3, 5, 2, 3],
                        borderColor: '#4e73df',
                        fill: false
                    }]
                }
            });
        }
    }

    

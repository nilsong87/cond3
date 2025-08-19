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

    // Objeto para armazenar as instâncias dos calendários
    const calendars = {};

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
     * Muda a seção de conteúdo exibida
     * @param {jQuery} $link - Link do menu clicado
     */
    function switchContentSection($link) {
        const target = $link.attr('href').substring(1);
        
        $('.sidebar-menu li').removeClass('active');
        $link.parent().addClass('active');
        
        // Oculta todas as seções
        $('.content-section').removeClass('active');
        
        // Mostra a seção alvo
        const $targetSection = $(`#${target}-section`);
        $targetSection.addClass('active');
        
        $('.header-title').text($link.text().trim());
        
        // Redesenha os calendários visíveis
        redrawVisibleCalendars();
        
        // Fecha sidebar em dispositivos móveis
        if ($window.width() < 992) {
            closeSidebar();
        }
    }

    /**
     * Redesenha todos os calendários visíveis
     */
    function redrawVisibleCalendars() {
        Object.keys(calendars).forEach(calendarId => {
            const calendarEl = document.getElementById(calendarId);
            if (calendarEl && $(calendarEl).is(':visible') && calendars[calendarId]) {
                setTimeout(() => {
                    calendars[calendarId].render();
                    calendars[calendarId].updateSize();
                }, 50);
            }
        });
    }

    /**
     * Inicializa um calendário FullCalendar
     * @param {string} elementId - ID do elemento do calendário
     * @param {Array} events - Array de eventos
     */
    function initCalendar(elementId, events) {
        const calendarEl = document.getElementById(elementId);
        if (!calendarEl) {
            console.error(`Elemento #${elementId} não encontrado`);
            return;
        }

        try {
            // Destrói qualquer instância existente
            if (calendars[elementId]) {
                calendars[elementId].destroy();
            }

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
                },
                height: 'auto',
                contentHeight: 'auto',
                aspectRatio: 1.5
            });
            
            calendar.render();
            
            // Armazena a referência do calendário
            calendars[elementId] = calendar;
            
            return calendar;
        } catch (error) {
            console.error(`Erro ao inicializar o calendário #${elementId}:`, error);
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

    // Inicializa os calendários
    initCalendar('dashboard-calendar', residentEvents);
    initCalendar('reservations-main-calendar', reservationEvents);

    // Redesenha os calendários quando a janela é redimensionada
    $window.on('resize', function() {
        redrawVisibleCalendars();
        
        // Fecha sidebar em dispositivos maiores
        if ($window.width() >= 992) {
            closeSidebar();
        }
    });

    // Adiciona labels para células da tabela em mobile
    function adaptReservationsTableForMobile() {
        if ($(window).width() < 768) {
            $('table tr').each(function() {
                $(this).find('td').each(function(i) {
                    const headerText = $('table thead th').eq(i).text();
                    $(this).attr('data-label', headerText);
                });
            });
        }
    }

    // Executa na carga e no redimensionamento
    adaptReservationsTableForMobile();
    $(window).resize(adaptReservationsTableForMobile);
});
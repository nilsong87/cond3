$(document).ready(function() {
    // Constantes para elementos do DOM
    const $sidebarToggle = $('.sidebar-toggle, #sidebarToggle');
    const $appSidebar = $('.app-sidebar');
    const $sidebarOverlay = $('.sidebar-overlay').length ? $('.sidebar-overlay') : $('<div class="sidebar-overlay"></div>').appendTo('body');
    const $body = $('body');
    const $window = $(window);
    const $sidebarLinks = $('.sidebar-menu a[href^="#"]');

    // ==============================================
    // FUNÇÕES AUXILIARES
    // ==============================================

    function toggleSidebar() {
        $appSidebar.toggleClass('active');
        $sidebarOverlay.toggleClass('active');
        $body.toggleClass('no-scroll');
    }

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
     * @param {string} target - ID da seção alvo (sem o #)
     */
    function switchContentSection(target) {
        console.log(`Tentando mostrar seção: ${target}`);
        
        // Remove a classe active de todos os itens do menu
        $('.sidebar-menu li').removeClass('active');
        
        // Adiciona a classe active apenas ao item clicado
        const $menuItem = $(`.sidebar-menu a[href="#${target}"]`).parent();
        $menuItem.addClass('active');
        
        // Esconde todas as seções de conteúdo
        $('.content-section').removeClass('active');
        
        // Mostra apenas a seção correspondente
        const $targetSection = $(`.content-section[id$="-section"][id^="${target}"]`);
        
        if ($targetSection.length) {
            $targetSection.addClass('active');
            
            // Atualiza o título do cabeçalho
            const sectionTitle = $menuItem.find('a').text().trim();
            $('.header-title').text(sectionTitle);
            
            // Atualiza a URL com o hash
            history.pushState(null, null, `#${target}`);
            
            console.log(`Seção ${target} mostrada com sucesso`);
        } else {
            console.error(`Seção para "${target}" não encontrada`);
            // Mostra a dashboard como fallback
            switchContentSection('dashboard');
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
    // EVENT LISTENERS
    // ==============================================

    // Menu Hamburguer
    $sidebarToggle.on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleSidebar();
    });
    
    // Fechar sidebar ao clicar no overlay
    $sidebarOverlay.on('click', closeSidebar);
    
    // Navegação do menu
    $sidebarLinks.on('click', function(e) {
        e.preventDefault();
        const target = $(this).attr('href').substring(1);
        console.log(`Clicou no menu: ${target}`);
        
        switchContentSection(target);
        
        // Fecha sidebar em dispositivos móveis
        if ($window.width() < 992) {
            closeSidebar();
        }
    });

     // Trata mudanças no hash da URL
    $(window).on('hashchange', function() {
        const target = window.location.hash.substring(1);
        if (target) {
            switchContentSection(target);
        }
    });

     // ==============================================
    // INICIALIZAÇÃO
    // ==============================================

    // Inicialização - Mostra a seção correta com base na URL
    const initialTarget = window.location.hash.substring(1) || 'dashboard';
    switchContentSection(initialTarget);

    // ==============================================
    // INICIALIZAÇÃO DOS COMPONENTES
    // ==============================================

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
            const $button = $(this);
            const originalText = $button.html();
            
            $button.html('<i class="fas fa-check"></i> Copiado!');
            setTimeout(() => {
                $button.html(originalText);
            }, 2000);
        }.bind(this)).catch(err => {
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

    // Inicialização - Mostra a seção correta com base na URL
    if (window.location.hash) {
        const target = window.location.hash.substring(1);
        switchContentSection(target);
    } else {
        switchContentSection('dashboard');
    }

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
});
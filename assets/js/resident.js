$(document).ready(function() {
    // Verifica se FullCalendar está disponível
    if (typeof FullCalendar === 'undefined') {
        console.error('FullCalendar não está carregado corretamente');
        return;
    }

    // Constantes para elementos do DOM
    const $sidebarToggle = $('.sidebar-toggle');
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
        $body.toggleClass('sidebar-open');
        
        // Atualizar atributo ARIA
        const isExpanded = $appSidebar.hasClass('active');
        $sidebarToggle.attr('aria-expanded', isExpanded);
    }

    /**
     * Fecha a sidebar
     */
    function closeSidebar() {
        $appSidebar.removeClass('active');
        $sidebarOverlay.removeClass('active');
        $body.removeClass('sidebar-open');
        $sidebarToggle.attr('aria-expanded', 'false');
    }

    /**
     * Verifica se a tela é mobile
     */
    function isMobileScreen() {
        return $window.width() <= 992;
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
        if (isMobileScreen()) {
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
        e.preventDefault();
        toggleSidebar();
    });
    
    // Fechar sidebar ao clicar no overlay
    $sidebarOverlay.on('click', closeSidebar);
    
    // Fechar sidebar ao clicar fora dela em telas móveis
    $(document).on('click', function(e) {
        if (isMobileScreen() && $appSidebar.hasClass('active') && 
            !$(e.target).closest('.app-sidebar').length && 
            !$(e.target).is($sidebarToggle)) {
            closeSidebar();
        }
    });
    
    // Alternar entre seções de conteúdo
    $('.sidebar-menu a').on('click', function(e) {
        e.preventDefault();
        switchContentSection($(this));
    });

    // Fechar sidebar ao clicar em um link (em mobile)
    $('.sidebar-menu a').on('click', function(e) {
        if (isMobileScreen()) {
            closeSidebar();
        }
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

    // Ajusta a sidebar no carregamento da página
    if (!isMobileScreen()) {
        $appSidebar.addClass('active');
        $sidebarToggle.attr('aria-expanded', 'true');
    } else {
        $appSidebar.removeClass('active');
        $sidebarToggle.attr('aria-expanded', 'false');
    }

    // Redesenha os calendários quando a janela é redimensionada
    $window.on('resize', function() {
        redrawVisibleCalendars();
        
        // Ajusta a sidebar no redimensionamento
        if (!isMobileScreen()) {
            $appSidebar.addClass('active');
            $sidebarOverlay.removeClass('active');
            $body.removeClass('sidebar-open');
            $sidebarToggle.attr('aria-expanded', 'true');
        } else {
            // Se redimensionou para mobile e sidebar está ativa, fecha
            if ($appSidebar.hasClass('active')) {
                closeSidebar();
            }
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

    // ==============================================
    // MANIPULAÇÃO DE FORMULÁRIOS E INTERAÇÕES
    // ==============================================

    // Validação de formulários
    $('form').on('submit', function(e) {
        e.preventDefault();
        
        const $form = $(this);
        let isValid = true;
        
        // Validação básica de campos obrigatórios
        $form.find('[required]').each(function() {
            const $field = $(this);
            
            if (!$field.val().trim()) {
                isValid = false;
                highlightError($field);
            } else {
                clearError($field);
            }
        });
        
        if (isValid) {
            // Simular envio bem-sucedido
            simulateFormSubmission($form);
        }
    });

    function highlightError($field) {
        $field.addClass('is-invalid');
        $field.closest('.mb-3').find('.invalid-feedback').remove();
        $field.after('<div class="invalid-feedback">Este campo é obrigatório</div>');
    }

    function clearError($field) {
        $field.removeClass('is-invalid');
        $field.closest('.mb-3').find('.invalid-feedback').remove();
    }

    function simulateFormSubmission($form) {
        const $submitBtn = $form.find('button[type="submit"]');
        const originalText = $submitBtn.html();
        
        // Simular loading
        $submitBtn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processando...');
        
        // Simular tempo de processamento
        setTimeout(() => {
            // Simular sucesso
            const modalId = $form.closest('.modal').attr('id');
            if (modalId) {
                $('#' + modalId).modal('hide');
            }
            
            // Mostrar notificação de sucesso
            showNotification('Sucesso!', 'Operação realizada com sucesso.', 'success');
            
            // Restaurar botão
            $submitBtn.prop('disabled', false).html(originalText);
            
            // Limpar formulário
            $form[0].reset();
            
        }, 1500);
    }

    // Notificações personalizadas
    function showNotification(title, message, type = 'info') {
        // Criar elemento de notificação
        const notification = $(`
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                <strong>${title}</strong> ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);
        
        // Adicionar ao topo do conteúdo
        $('.app-content').prepend(notification);
        
        // Remover automaticamente após 5 segundos
        setTimeout(() => {
            notification.alert('close');
        }, 5000);
    }

    // Manipulação de QR Codes
    $('[data-bs-target="#qrCodeModal"]').on('click', function() {
        const reservationId = $(this).data('reservation-id');
        generateQRCode(reservationId);
    });

    function generateQRCode(data) {
        $('#qrcode').empty();
        
        // Gerar dados fictícios para o QR Code
        const qrData = JSON.stringify({
            id: data || 'RES-' + Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            type: 'reservation'
        });
        
        // Gerar QR Code (usando a biblioteca qrcodejs)
        new QRCode(document.getElementById('qrcode'), {
            text: qrData,
            width: 200,
            height: 200,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    // Compartilhamento de QR Code
    $('#shareQR').on('click', function() {
        if (navigator.share) {
            navigator.share({
                title: 'QR Code de Acesso',
                text: 'Compartilhe este QR Code para acesso à área comum',
                url: window.location.href
            }).catch(console.error);
        } else {
            alert('Funcionalidade de compartilhamento não suportada neste navegador.');
        }
    });

    // WhatsApp sharing
    $('#whatsappQR').on('click', function() {
        const text = encodeURIComponent('Confira meu QR Code de acesso: ' + window.location.href);
        window.open('https://wa.me/?text=' + text, '_blank');
    });

    // Cópia de código PIX
    $('#copyPixButton').on('click', function() {
        const pixCode = $('input[type="text"]', $(this).closest('.input-group')).val();
        
        navigator.clipboard.writeText(pixCode).then(() => {
            showNotification('Copiado!', 'Código PIX copiado para a área de transferência.', 'success');
        }).catch(err => {
            console.error('Erro ao copiar texto: ', err);
            showNotification('Erro', 'Não foi possível copiar o código.', 'danger');
        });
    });

    // Sistema de votação
    $('.voting-actions .btn').on('click', function() {
        const $card = $(this).closest('.voting-card');
        const voteType = $(this).hasClass('btn-success') ? 'sim' : 'não';
        
        // Desabilitar botões após votação
        $card.find('.voting-actions .btn').prop('disabled', true);
        
        // Simular envio do voto
        setTimeout(() => {
            showNotification('Voto registrado!', `Seu voto (${voteType}) foi registrado com sucesso.`, 'success');
            
            // Atualizar visualmente a barra de progresso (apenas visual)
            if (voteType === 'sim') {
                const $progressBar = $card.find('.progress-bar.bg-success');
                const currentWidth = parseInt($progressBar.css('width'));
                $progressBar.css('width', (currentWidth + 5) + '%').text((currentWidth + 5) + '%');
            }
        }, 1000);
    });

    // ==============================================
    // OTIMIZAÇÕES DE PERFORMANCE
    // ==============================================

    // Carregamento lazy de imagens
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        $('img.lazy').each(function() {
            lazyImageObserver.observe(this);
        });
    }

    // Debounce para eventos de resize
    let resizeTimer;
    $(window).on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            redrawVisibleCalendars();
            adaptReservationsTableForMobile();
        }, 250);
    });

    // ==============================================
    // TRATAMENTO DE ERROS
    // ==============================================

    // Capturar erros não tratados
    window.addEventListener('error', function(e) {
        console.error('Erro capturado:', e.error);
        showNotification('Erro', 'Ocorreu um erro inesperado. Tente novamente.', 'danger');
    });

    // Capturar promessas rejeitadas não tratadas
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Promise rejeitada:', e.reason);
        showNotification('Erro', 'Ocorreu um erro inesperado. Tente novamente.', 'danger');
        e.preventDefault();
    });

    // ==============================================
    // PWA - SERVICE WORKER
    // ==============================================

    // Registrar Service Worker para funcionalidade PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('sw.js')
                .then(function(registration) {
                    console.log('SW registered: ', registration);
                })
                .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

    // ==============================================
    // INICIALIZAÇÃO FINAL
    // ==============================================

    // Inicializar tooltips do Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Inicializar popovers do Bootstrap
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    const popoverList = popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    console.log('Aplicação do Condomínio Premium inicializada com sucesso!');
});
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página carregada - a iniciar...');
    
    // Carregar anúncios primeiro
    loadListings();
    
    // Inicializar modal
    initModal();
    
    // Iniciar botões dos anúncios
    function initListingButtons() {
        console.log('A iniciar botões dos anúncios...');
    
        let isModalOpening = false; // Prevenir múltiplos cliques
    
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('view-listing')) {
                e.preventDefault();
            
                if (isModalOpening) return; // Prevenir clique duplo
                isModalOpening = true;
            
                const listingId = e.target.getAttribute('data-id');
                const modal = document.getElementById('listing-modal');
            
                console.log('Clicou no anúncio:', listingId);
            
                if (modal) {
                    loadListingDetails(listingId);
                    modal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                }
            
                // Reset após 500ms
                setTimeout(() => { isModalOpening = false; }, 500);
            }
        });
    }

    // Chamar a função para iniciar os botões dos anúncios
    initListingButtons();

    // Iniciar eventos de filtro
    initFilterEvents();
    
    // Evento para o formulário de pesquisa
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            applyFilters();
        });
    }

    // Evento para o botão "Ligar Agora" - usar event delegation
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('call')) {
            e.preventDefault();
            alert('A ligar para +351 939 058 907...');
        }
    });
    
    // Adicionar evento para limpar filtros
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', function(e) {
            e.preventDefault();
            resetFilters();
        });
    }
});

// Dados dos anúncios
const listingsData = [
    {
        id: 1,
        title: 'BMW 320d',
        price: 28500,
        image: 'imagens/bmw.png',
        year: 2019,
        kilometers: 85000,
        fuel: 'Diesel',
        brand: 'bmw',
        model: 'série 3',
        description: 'BMW 320d Luxury',
        details: {
            marca: 'BMW',
            modelo: 'Série 3 320d',
            ano: '2019',
            quilometros: '85.000 km',
            combustivel: 'Diesel',
            potencia: '190 cv',
            cor: 'Azul',
            caixa: 'Automática',
            garantia: '12 meses'
        },
        fullDescription: 'BMW 320d Luxury em excelente estado, com manutenção sempre feita na marca. Equipado com pacote Luxury, navegação, bancos em pele e sensores de estacionamento.'
    },
    {
        id: 2,
        title: 'Audi A4 Avant',
        price: 32900,
        image: 'imagens/audi.png',
        year: 2020,
        kilometers: 45000,
        fuel: 'Diesel',
        brand: 'audi',
        model: 'a4',
        description: 'Audi A4 Avant 2.0 TDI S tronic sport',
        details: {
            marca: 'Audi',
            modelo: 'A4 Avant',
            ano: '2020',
            quilometros: '45.000 km',
            combustivel: 'Diesel',
            potencia: '150 cv',
            cor: 'Cinza',
            caixa: 'Automática',
            garantia: '12 meses'
        },
        fullDescription: 'Audi A4 Avant 2.0 TDI S tronic sport, único dono, sempre de garagem. Equipamento completo: teto solar, bancos desportivos, sistema de som premium.'
    },
    {
        id: 3,
        title: 'Mercedes-Benz C300h',
        price: 35750,
        image: 'imagens/mercedes.png',
        year: 2021,
        kilometers: 30000,
        fuel: 'Híbrido',
        brand: 'mercedes',
        model: 'classe c',
        description: 'Mercedes-Benz C300h AMG Line',
        details: {
            marca: 'Mercedes-Benz',
            modelo: 'C300h',
            ano: '2021',
            quilometros: '30.000 km',
            combustivel: 'Híbrido',
            potencia: '228 cv',
            cor: 'Preto',
            caixa: 'Automática',
            garantia: '12 meses'
        },
        fullDescription: 'Mercedes-Benz C300h AMG Line, tecnologia híbrida plug-in, consumo reduzido. Jantes AMG, faróis LED, interior em pele e madeira.'
    },
    {
        id: 4,
        title: 'Yamaha MT-07',
        price: 6990,
        image: 'imagens/yamaha.png',
        year: 2018,
        kilometers: 12000,
        fuel: 'Gasolina',
        brand: 'yamaha',
        model: 'mt-07',
        description: 'Yamaha MT-07',
        details: {
            marca: 'Yamaha',
            modelo: 'MT-07',
            ano: '2018',
            quilometros: '12.000 km',
            combustivel: 'Gasolina',
            cilindrada: '689 cc',
            cor: 'Preto',
            tipo: 'Naked',
            garantia: '6 meses'
        },
        fullDescription: 'Yamaha MT-07 em perfeito estado, sempre guardada em garagem. Inclui capa e documentação completa. Mota ágil e divertida.'
    },
    {
        id: 5,
        title: 'Ford Focus',
        price: 13900,
        image: 'imagens/ford.png',
        year: 2018,
        kilometers: 65000,
        fuel: 'Gasolina',
        brand: 'ford',
        model: 'focus',
        description: 'Ford Focus 1.0 EcoBoost Titanium',
        details: {
            marca: 'Ford',
            modelo: 'Focus Titanium',
            ano: '2018',
            quilometros: '65.000 km',
            combustivel: 'Gasolina',
            potencia: '125 cv',
            cor: 'Cinza',
            caixa: 'Manual',
            garantia: '12 meses'
        },
        fullDescription: 'Ford Focus 1.0 EcoBoost Titanium, motor económico e fiável. Equipamento completo: climatização automática, sensores de estacionamento, sistema SYNC3.'
    },
    {
        id: 6,
        title: 'Toyota Corolla',
        price: 22900,
        image: 'imagens/toyota.png',
        year: 2020,
        kilometers: 35000,
        fuel: 'Híbrido',
        brand: 'toyota',
        model: 'corolla',
        description: 'Toyota Corolla 1.8 Hybrid Comfort',
        details: {
            marca: 'Toyota',
            modelo: 'Corolla Hybrid',
            ano: '2020',
            quilometros: '35.000 km',
            combustivel: 'Híbrido',
            potencia: '122 cv',
            cor: 'Cinza',
            caixa: 'Automática',
            garantia: '12 meses'
        },
        fullDescription: 'Toyota Corolla 1.8 Hybrid Comfort, consumo extremamente reduzido. Manutenção sempre na marca, pneus novos, estado impecável.'
    },
    {
        id: 7,
        title: 'Renault Kadjar',
        price: 11950,
        image: 'imagens/renault.png',
        year: 2016,
        kilometers: 116500,
        fuel: 'Gasolina',
        brand: 'renault',
        model: 'kadjar',
        description: 'Renault Kadjar 1.2 TCe Energy Intens',
        details: {
            marca: 'Renault',
            modelo: 'Kadjar',
            ano: '2016',
            quilometros: '116.500 km',
            combustivel: 'Gasolina',
            potencia: '130 cv',
            cor: 'Vermelho',
            caixa: 'Manual',
            garantia: '12 meses'
        },
        fullDescription: 'Renault Kadjar 1.2 TCe 130 Energy Intens, SUV familiar espaçoso. Recentemente revisão completa, pneus novos, pronto a circular.'
    }
];

// Variável global para anúncios filtrados
let filteredListings = [...listingsData];

// Função para carregar os anúncios
function loadListings(listingsToShow = listingsData) {
    const container = document.getElementById('listings-container');
    
    if (!container) {
        console.error('Container de anúncios não encontrado!');
        return;
    }
    
    console.log('A carregar anúncios...', listingsToShow.length);
    
    if (listingsToShow.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <h3>Nenhum veículo encontrado</h3>
                <p>Tente ajustar os filtros da sua pesquisa.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = listingsToShow.map(listing => `
        <div class="listing-card">
            <div class="listing-image" style="background-image: url('${listing.image}')">
                <div class="image-placeholder" style="display: none;">Imagem não disponível</div>
            </div>
            <div class="listing-details">
                <h3 class="listing-title">${listing.title}</h3>
                <div class="listing-price">${formatPrice(listing.price)}</div>
                <div class="listing-info">
                    <span>${listing.year}</span>
                    <span>${formatKilometers(listing.kilometers)}</span>
                    <span>${listing.fuel}</span>
                </div>
                <p class="listing-description">${listing.description}</p>
                <a href="#" class="view-listing" data-id="${listing.id}">Ver detalhes</a>
            </div>
        </div>
    `).join('');
    
    console.log('Anúncios carregados com sucesso!');
}

// Função para formatar preço
function formatPrice(price) {
    return new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0
    }).format(price);
}

// Função para formatar quilómetros
function formatKilometers(km) {
    return new Intl.NumberFormat('pt-PT').format(km) + ' km';
}

// Iniciar eventos de filtro
function initFilterEvents() {
    console.log('A iniciar eventos de filtro...');
    
    // Filtro em tempo real para alguns campos
    const marcaSelect = document.getElementById('marca');
    const combustivelSelect = document.getElementById('combustivel');
    const precoSelect = document.getElementById('preco');
    const anoSelect = document.getElementById('ano');
    const quilometrosSelect = document.getElementById('quilometros');
    
    if (marcaSelect) {
        marcaSelect.addEventListener('change', applyFilters);
    }
    if (combustivelSelect) {
        combustivelSelect.addEventListener('change', applyFilters);
    }
    if (precoSelect) {
        precoSelect.addEventListener('change', applyFilters);
    }
    if (anoSelect) {
        anoSelect.addEventListener('change', applyFilters);
    }
    if (quilometrosSelect) {
        quilometrosSelect.addEventListener('change', applyFilters);
    }
}

// Aplicar filtros
function applyFilters() {
    console.log('A aplicar filtros...');
    
    const marca = document.getElementById('marca').value;
    const combustivel = document.getElementById('combustivel').value;
    const precoMax = document.getElementById('preco').value;
    const anoMin = document.getElementById('ano').value;
    const kmMax = document.getElementById('quilometros').value;
    
    // Aplicar filtros
    filteredListings = listingsData.filter(listing => {
        // Filtro por marca
        if (marca && listing.brand !== marca) return false;
        
        // Filtro por combustível
        if (combustivel) {
            // Normalizar ambos os valores para comparação
            const combustivelListing = listing.fuel.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const combustivelFiltro = combustivel.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            
            if (combustivelListing !== combustivelFiltro) return false;
        }
        
        // Filtro por preço
        if (precoMax && listing.price > parseInt(precoMax)) return false;
        
        // Filtro por ano
        if (anoMin && listing.year < parseInt(anoMin)) return false;
        
        // Filtro por quilómetros
        if (kmMax && listing.kilometers > parseInt(kmMax)) return false;
        
        return true;
    });

    // Atualizar contador de resultados
    updateResultsCount(filteredListings.length);
    
    // Recarregar anúncios com filtros aplicados
    loadListings(filteredListings);
}

// Atualizar contador de resultados
function updateResultsCount(count) {
    let resultsText = document.querySelector('.results-count');
    
    if (!resultsText) {
        // Criar elemento se não existir
        const sectionTitle = document.querySelector('.section-title');
        if (sectionTitle) {
            resultsText = document.createElement('span');
            resultsText.className = 'results-count';
            sectionTitle.parentNode.insertBefore(resultsText, sectionTitle.nextSibling);
        }
    }
    
    if (resultsText) {
        if (count === listingsData.length) {
            resultsText.textContent = `${count} veículos disponíveis`;
        } else {
            resultsText.textContent = `${count} veículo(s) encontrado(s)`;
        }
    }
}

// Funções para o modal
function initModal() {
    const modal = document.getElementById('listing-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (!modal) {
        console.error('Modal não encontrado!');
        return;
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    console.log('Modal iniciado com sucesso!');
}

// Carregar detalhes do anúncio
function loadListingDetails(listingId) {
    console.log('A carregar detalhes do anúncio:', listingId);
    
    const listing = listingsData.find(item => item.id === parseInt(listingId));
    
    if (listing) {
        updateModalContent(listing);
        console.log('Detalhes do anúncio carregados com sucesso!');
    } else {
        console.error('Anúncio não encontrado:', listingId);
    }
}

// Atualizar conteúdo do modal
function updateModalContent(listing) {
    const modalHeader = document.querySelector('.modal-header');
    const modalTitle = document.querySelector('.modal-title');
    const modalPrice = document.querySelector('.modal-price');
    const detailsContainer = document.querySelector('.modal-details');
    const descriptionText = document.querySelector('.modal-description p');
    
    if (modalHeader) modalHeader.style.backgroundImage = `url('${listing.image}')`;
    if (modalTitle) modalTitle.textContent = listing.title;
    if (modalPrice) modalPrice.textContent = formatPrice(listing.price);
    
    // Atualizar detalhes
    if (detailsContainer) {
        detailsContainer.innerHTML = '';
        
        for (const [key, value] of Object.entries(listing.details)) {
            const detailItem = document.createElement('div');
            detailItem.className = 'detail-item';
            detailItem.innerHTML = `
                <span class="detail-label">${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <span class="detail-value">${value}</span>
            `;
            detailsContainer.appendChild(detailItem);
        }
    }
    
    // Atualizar descrição
    if (descriptionText) {
        descriptionText.textContent = listing.fullDescription;
    }
}

// Adicionar função para limpar filtros
function resetFilters() {
    document.getElementById('marca').value = '';
    document.getElementById('combustivel').value = '';
    document.getElementById('preco').value = '';
    document.getElementById('ano').value = '';
    document.getElementById('quilometros').value = '';
    
    applyFilters();
}
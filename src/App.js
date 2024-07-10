import React, { useState, useEffect } from 'react';
import './RickAndMortyData.css';

function RickAndMortyData() {
  // State hooks to manage data, filters, sorting, pagination, errors, and selected item
  const [data, setData] = useState([]);  
  const [dataType, setDataType] = useState('character');  // Tracks currently selected data type ('character', 'location', 'episode')
  const [currentPage, setCurrentPage] = useState(1); 
  const [pageSize, setPageSize] = useState(20);  
  const [filters, setFilters] = useState({  
    name: '',
    status: '',
    species: '',
    type: '',
    gender: '',
    dimension: '',
    episode: '',
  });
  const [sortBy, setSortBy] = useState('');  
  const [sortOrder, setSortOrder] = useState('asc');  
  const [error, setError] = useState(null);  
  const [noData, setNoData] = useState(false);  
  const [selectedItem, setSelectedItem] = useState(null);  

  // Effect hook to fetch data from the Rick and Morty API based on current filters and settings
  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `https://rickandmortyapi.com/api/${dataType}`;
        let allData = [];

        // Fetching all pages of data for the selected dataType
        while (url) {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Error fetching ${dataType} data: ${response.status} - ${response.statusText}`);
          }
          const data = await response.json();
          allData = [...allData, ...data.results];
          url = data.info.next;
        }

        // Filtering data based on current filters for characters, locations, or episodes
        const filteredData = allData.filter((item) => {
          if (dataType === 'character') {
            // Matching filters for character data
            const nameMatch = filters.name ? item.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
            const statusMatch = filters.status ? item.status.toLowerCase().includes(filters.status.toLowerCase()) : true;
            const speciesMatch = filters.species ? item.species.toLowerCase().includes(filters.species.toLowerCase()) : true;
            const typeMatch = filters.type ? item.type.toLowerCase().includes(filters.type.toLowerCase()) : true;
            const genderMatch = filters.gender ? item.gender.toLowerCase() === filters.gender.toLowerCase() : true;
            return nameMatch && statusMatch && speciesMatch && typeMatch && genderMatch;
          } else if (dataType === 'location') {
            // Matching filters for location data
            const nameMatch = filters.name ? item.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
            const typeMatch = filters.type ? item.type.toLowerCase().includes(filters.type.toLowerCase()) : true;
            const dimensionMatch = filters.dimension ? item.dimension.toLowerCase().includes(filters.dimension.toLowerCase()) : true;
            return nameMatch && typeMatch && dimensionMatch;
          } else if (dataType === 'episode') {
            // Matching filters for episode data
            const nameMatch = filters.name ? item.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
            const episodeMatch = filters.episode ? item.episode.toLowerCase().includes(filters.episode.toLowerCase()) : true;
            return nameMatch && episodeMatch;
          }
          return true;  
        });

        // Sorting filtered data based on sortBy and sortOrder
        const sortedData = sortBy
          ? filteredData.sort((a, b) => {
              if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
              if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
              return 0;
            })
          : filteredData;

        // Updating state with sorted and filtered data
        setData(sortedData);
        setError(null);
        setNoData(filteredData.length === 0);  
      } catch (error) {
        console.error(error);
        setError(error.message);  
        setNoData(false);
      }
    };

    fetchData();  
  }, [dataType, filters, sortBy, sortOrder]);

  // Utility function to format date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Handler function to change dataType and reset filters, sorting, pagination, and selectedItem
  const handleDataTypeChange = (type) => {
    setDataType(type);
    setCurrentPage(1);
    setFilters({  // Resetting filters based on selected dataType
      name: '',
      status: '',
      species: '',
      type: '',
      gender: '',
      dimension: '',
      episode: '',
    });
    setSortBy('');  
    setSortOrder('asc');
    setPageSize(20);  
    setSelectedItem(null);  
  };

  // Handler function to update filter values
  const handleFilterChange = (filterName, filterValue) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: filterValue,
    }));
    setCurrentPage(1);  
    setSelectedItem(null);  
  };

  // Handler function to update sortBy and sortOrder
  const handleSortChange = (sortField, order) => {
    setSortBy(sortField);
    setSortOrder(order);
    setSelectedItem(null);  
  };

  // Handler function to update pageSize and reset currentPage and selectedItem
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);  
    setSelectedItem(null); 
  };

  // Handler function to set selectedItem on item click
  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  // Paginating data based on currentPage and pageSize
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Rendering component UI with buttons for changing data type, filters, sorting, and paginated data display
  return (
    <div>
      <h1>Rick and Morty Data</h1>
      {error && <div style={{ color: 'red', fontWeight: 'bold' }}>{error}</div>}
      {noData && <div style={{ color: 'red', fontWeight: 'bold' }}>No data found for the current filters.</div>}
      <div>
        {/* Buttons to select data type (character, location, episode) */}
        <button
          onClick={() => handleDataTypeChange('character')}
          className={dataType === 'character' ? 'active' : ''}
        >
          Characters
        </button>
        <button
          onClick={() => handleDataTypeChange('location')}
          className={dataType === 'location' ? 'active' : ''}
        >
          Locations
        </button>
        <button
          onClick={() => handleDataTypeChange('episode')}
          className={dataType === 'episode' ? 'active' : ''}
        >
          Episodes
        </button>
      </div>
      <div>
        {/* Filters section based on selected dataType */}
        <h3>Filters</h3>
        <div>
          {dataType === 'character' && (
            <>
              {/* Filter inputs for character data */}
              <label>
                Name:
                <input
                  type="text"
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                />
              </label>
              <label>
                Status:
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All</option>
                  <option value="alive">Alive</option>
                  <option value="dead">Dead</option>
                  <option value="unknown">Unknown</option>
                </select>
              </label>
              <label>
                Species:
                <input
                  type="text"
                  value={filters.species}
                  onChange={(e) => handleFilterChange('species', e.target.value)}
                />
              </label>
              <label>
                Type:
                <input
                  type="text"
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                />
              </label>
              <label>
                Gender:
                <select
                  value={filters.gender}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                >
                  <option value="">All</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="genderless">Genderless</option>
                  <option value="unknown">Unknown</option>
                </select>
              </label>
            </>
          )}
          {dataType === 'location' && (
            <>
              {/* Filter inputs for location data */}
              <label>
                Name:
                <input
                  type="text"
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                />
              </label>
              <label>
                Type:
                <input
                  type="text"
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                />
              </label>
              <label>
                Dimension:
                <input
                  type="text"
                  value={filters.dimension}
                  onChange={(e) => handleFilterChange('dimension', e.target.value)}
                />
              </label>
            </>
          )}
          {dataType === 'episode' && (
            <>
              {/* Filter inputs for episode data */}
              <label>
                Name:
                <input
                  type="text"
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                />
              </label>
              <label>
                Episode:
                <input
                  type="text"
                  value={filters.episode}
                  onChange={(e) => handleFilterChange('episode', e.target.value)}
                />
              </label>
            </>
          )}
          <label>
            Page Size:
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            >
              {/* Options to select page size */}
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>
        </div>
      </div>
      <div>
        <h3>Sort By:</h3>
        <div>
          {dataType === 'character' && (
            <>
              {/* Buttons to sort character data */}
              <button
                onClick={() => handleSortChange('id', 'asc')}
                className={sortBy === 'id' && sortOrder === 'asc' ? 'active' : ''}
              >
                ID (Ascending)
              </button>
              <button
                onClick={() => handleSortChange('id', 'desc')}
                className={sortBy === 'id' && sortOrder === 'desc' ? 'active' : ''}
              >
                ID (Descending)
              </button>
              <button
                onClick={() => handleSortChange('name', 'asc')}
                className={sortBy === 'name' && sortOrder === 'asc' ? 'active' : ''}
              >
                Name (A-Z)
              </button>
              <button
                onClick={() => handleSortChange('name', 'desc')}
                className={sortBy === 'name' && sortOrder === 'desc' ? 'active' : ''}
              >
                Name (Z-A)
              </button>
            </>
          )}
          {dataType === 'location' && (
            <>
              {/* Buttons to sort location data */}
              <button
                onClick={() => handleSortChange('name', 'asc')}
                className={sortBy === 'name' && sortOrder === 'asc' ? 'active' : ''}
              >
                Name (A-Z)
              </button>
              <button
                onClick={() => handleSortChange('name', 'desc')}
                className={sortBy === 'name' && sortOrder === 'desc' ? 'active' : ''}
              >
                Name (Z-A)
              </button>
              <button
                onClick={() => handleSortChange('type', 'asc')}
                className={sortBy === 'type' && sortOrder === 'asc' ? 'active' : ''}
              >
                Type (A-Z)
              </button>
              <button
                onClick={() => handleSortChange('type', 'desc')}
                className={sortBy === 'type' && sortOrder === 'desc' ? 'active' : ''}
              >
                Type (Z-A)
              </button>
            </>
          )}
          {dataType === 'episode' && (
            <>
              {/* Buttons to sort episode data */}
              <button
                onClick={() => handleSortChange('name', 'asc')}
                className={sortBy === 'name' && sortOrder === 'asc' ? 'active' : ''}
              >
                Name (A-Z)
              </button>
              <button
                onClick={() => handleSortChange('name', 'desc')}
                className={sortBy === 'name' && sortOrder === 'desc' ? 'active' : ''}
              >
                Name (Z-A)
              </button>
              <button
                onClick={() => handleSortChange('episode', 'asc')}
                className={sortBy === 'episode' && sortOrder === 'asc' ? 'active' : ''}
              >
                Episode (A-Z)
              </button>
              <button
                onClick={() => handleSortChange('episode', 'desc')}
                className={sortBy === 'episode' && sortOrder === 'desc' ? 'active' : ''}
              >
                Episode (Z-A)
              </button>
            </>
          )}
        </div>
      </div>
      <div>
        {error && <div style={{ color: 'red', fontWeight: 'bold' }}>{error}</div>}
        {noData && <div style={{ color: 'red', fontWeight: 'bold' }}>No data found for the current filters.</div>}
        {!error && !noData && paginatedData && Array.isArray(paginatedData) && paginatedData.length > 0 && (
          paginatedData.map((item) => (
            <div key={item.id} className={`item-card ${dataType}-card`} onClick={() => handleItemClick(item)}>
              {dataType === 'character' && (
                <>
                  {/* Character card details */}
                  <img src={item.image} alt={item.name} />
                  {selectedItem && selectedItem.id === item.id && (
                    <div className="character-details">
                      <h3>{item.name || 'N/A'}</h3>
                      <p>ID: {item.id}</p>
                      <p>Status: {item.status || 'N/A'}</p>
                      <p>Species: {item.species || 'N/A'}</p>
                      <p>Type: {item.type || 'N/A'}</p>
                      <p>Gender: {item.gender || 'N/A'}</p>
                      <p>Origin: {item.origin?.name || 'N/A'}</p>
                      <p>Location: {item.location?.name || 'N/A'}</p>
                      <p>Episodes: {item.episode?.length || 0}</p>
                      <p className="item-detail">Created: {formatDate(item.created)}</p>
                    </div>
                  )}
                </>
              )}
              {dataType === 'location' && (
                <>
                  {/* Location card details */}
                  <h3>{item.name || 'N/A'}</h3>
                  {selectedItem && selectedItem.id === item.id && (
                    <div className="location-details">
                      <p>ID: {item.id}</p>
                      <p>Type: {item.type || 'N/A'}</p>
                      <p>Dimension: {item.dimension || 'N/A'}</p>
                      <p className="item-detail">Created: {formatDate(item.created)}</p>
                    </div>
                  )}
                </>
              )}
              {dataType === 'episode' && (
                <>
                  {/* Episode card details */}
                  <h3>{item.name || 'N/A'}</h3>
                  {selectedItem && selectedItem.id === item.id && (
                    <div className="episode-details">
                      <p>ID: {item.id}</p>
                      <p>Air Date: {item.air_date || 'N/A'}</p>
                      <p>Episode: {item.episode || 'N/A'}</p>
                      <p className="item-detail">Created: {formatDate(item.created)}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
      <div>
        {/* Buttons for navigating through paginated data */}
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous Page
        </button>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={!data || (Array.isArray(data) && data.length < pageSize * currentPage) || (Array.isArray(data) && data.length === 0)}
        >
          Next Page
        </button>
      </div>
    </div>
  );
}

export default RickAndMortyData;

async function getWeather() {
      const city = document.getElementById('city').value;
      const errorEl = document.getElementById('error');
      const resultEl = document.getElementById('result');
      
      if (!city) {
        errorEl.innerHTML = 'Enter city name';
        resultEl.innerHTML = '';
        return;
      }
      
      errorEl.innerHTML = '';
      resultEl.innerHTML = 'Loading...';
      
      try {
        const weather1 = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
        const weather2 = await weather1.json();
        
        if (!weather2.results?.[0]) {
          throw new Error('City not found');
        }
        
        const { latitude, longitude } = weather2.results[0];
        
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,precipitation_probability&timezone=auto`
        );
        const weatherData = await weatherRes.json();
        
        const current = weatherData.current_weather;
        const temp = Math.round(current.temperature);
        
        resultEl.innerHTML = `
          <h3>${city.toUpperCase()}</h3>
          <p>🌡️ ${temp}°C</p>
          <p>💨 ${current.windspeed.toFixed(0)} km/h</p>
          <p>🌤️ ${getWeatherIcon(current.weathercode)}</p>
        `;
        
      } catch (err) {
        errorEl.innerHTML = 'City not found';
        resultEl.innerHTML = '';
      }
    }
    
    function getWeatherIcon(code) {
      const icons = {
        0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
        45: '🌫️', 48: '🌫️', 51: '🌦️', 53: '🌦️',
        55: '🌧️', 61: '🌧️', 63: '🌧️', 65: '⛈️',
        71: '🌨️', 73: '🌨️', 75: '❄️', 80: '🌦️',
        95: '⛈️', 99: '⛈️'
      };
      return icons[code] || '🌤️';
    }
    
    document.getElementById('city').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') getWeather();
    });
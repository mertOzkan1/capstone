// App.js

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Chart from 'chart.js/auto';

const socket = io('http://localhost:3000'); // Socket.io sunucu adresi

const App = () => {
  const [data, setData] = useState([0, 0, 0, 0]); // Gelen verileri saklamak için state

  useEffect(() => {
    // Socket'ten gelen verileri dinle
    socket.on('data', newData => {
      setData(newData); // Yeni verileri state'e kaydet
    });

    // Temizlik
    return () => {
      socket.disconnect(); // Komponentten çıkarken soketi kapat
    };
  }, []);

  useEffect(() => {
    // Grafik oluşturma
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['AI0', 'AI1', 'AI2', 'AI3'], // Örnek: Port isimleri
        datasets: [{
          label: 'Veri',
          data: data, // State'ten gelen verileri kullan
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Temizlik
    return () => myChart.destroy();
  }, [data]);

  return (
    <div>
      <h1>DAQ Veri Görselleştirme</h1>
      <div style={{ width: '80%', margin: 'auto' }}>
        <canvas id="myChart"></canvas>
      </div>
    </div>
  );
};

export default App;

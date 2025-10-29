# VEHICLE TRACKER APPLICATION

This project is a web-based vehicle tracking interface built using **React.js** and **Leaflet**.  
It displays a vehicle’s movement path on a map, shows live details such as speed, distance, and battery status, and includes playback and configuration options.

---

## PROJECT OVERVIEW
The Vehicle Tracker Application provides a simplified simulation of a real-world GPS tracking dashboard.  
It uses map rendering and playback controls to visualize route data stored in a JSON file.

---

## KEY FEATURES
- Light Google Map style interface for clean visual appearance  
- Vehicle movement along route coordinates (`dummy-route.json`)  
- Car marker automatically aligns with travel path  
- Playback controls for **Play**, **Reset**, and **Show**  
- Speed control slider for animation speed adjustment  
- Config modal with slide-up drawer design  
- Information card displaying live diagnostic data (speed, coordinates, battery)  
- Follow mode keeps map centered on moving vehicle  
- Responsive design using Tailwind CSS  
- No external backend required (runs on local JSON data)

---

## TECH STACK
**Frontend Framework:** React.js  
**Map Library:** React Leaflet (Leaflet.js)  
**Styling:** Tailwind CSS  
**Icons:** Custom inline SVG  
**Animation:** JavaScript timing + React hooks  
**Data Source:** `dummy-route.json`

---

## PROJECT STRUCTURE
src/
├── components/
│ ├── VehicleMap.jsx # Main map and playback logic
│ ├── ControlPanel.jsx # Control bar at bottom
│ └── ConfigModal.jsx # Drawer for configuration (if separate)
├── index.css # Tailwind and custom styles
├── App.js # Application root
└── dummy-route.json # Sample route data file


---

## SETUP INSTRUCTIONS

**Step 1. Install dependencies**  
Run the following command in the project directory:


npm install


**Step 2. Start the development server**


npm start


**Step 3. Open your browser**  
Visit: [http://localhost:5173](http://localhost:5173)

---

## DATA FORMAT
The file `dummy-route.json` should be located in the `public/` directory and follow this structure:
```json
[
  {
    "latitude": 17.385044,
    "longitude": 78.486671,
    "timestamp": "2025-10-29T07:09:00Z"
  },
  {
    "latitude": 17.385244,
    "longitude": 78.486871,
    "timestamp": "2025-10-29T07:09:05Z"
  }
]


Each entry represents a GPS point in the route.

HOW TO USE

Open the app in your browser.

Press the PLAY button to start vehicle movement.

Press RESET to restart playback.

Click SHOW to reveal the configuration drawer.

Adjust playback speed using the slider.

Enable FOLLOW mode to keep the map centered on the vehicle.

Observe speed, distance, and coordinates in the info panel.

STYLING AND UI DESIGN

Uses a light Google Map theme (CartoDB tiles).

Bottom control bar has a curved white pill design with subtle shadow.

The configuration modal slides up smoothly from the bottom.

All UI components are responsive and styled with Tailwind CSS.

TROUBLESHOOTING

If map tiles do not load, check your internet connection.

Ensure dummy-route.json is placed inside the public/ folder.

If the car icon appears offset, refresh after saving VehicleMap.jsx updates.

Run:

npm install react-leaflet leaflet


if map dependencies are missing.

FUTURE ENHANCEMENTS

Smooth animation between coordinates using interpolation

Multiple vehicle tracking support

Real API integration for live GPS data

Exportable reports and route playback analytics

Dark theme map option

AUTHOR

Developed by Madhav Potha Gouni
Email: pothagounimadhav@gmail.com

GitHub: https://github.com/MadhavPothaGouni

LinkedIn: https://www.linkedin.com/in/madhav-pothagouni-4a3aa3279/

LICENSE

This project is open for educational and demonstration purposes.


---

### 💡 How to apply this fix:
1. Open your project folder.  
2. Replace your current `README.md` content with the above formatted text.  
3. Commit and push again:


git add README.md
git commit -m "Formatted README for GitHub"
git push


Once you refresh your GitHub repository page,  
your README will now appear **properly formatted with sections, spacing, and code blocks.**

---

Would you like me to add a **preview image (screenshot)** or **GitHub badges** (like “Built with React”, “License: MIT”)?  
That can make your README look even more professional.
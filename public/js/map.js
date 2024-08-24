

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [coordinates[0], coordinates[1]], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

const marker1 = new mapboxgl.Marker({ color: "red" })
    .setLngLat([coordinates[0], coordinates[1]])
    .addTo(map)
.setPopup( new mapboxgl.Popup({ closeOnClick: false })
        
        // .setHTML(`<h5>${title}</h5><p>The exact location will be provided after the booking.</p>`)
        .setHTML(`
           
                <h5 style="margin: 0 0 10px; font-size: 18px; color: #007bff; font-weight: bold;">${title}</h5>
                <p style="margin: 0 0 10px; font-size: 14px; color: #555;">The exact location will be provided after the booking.</p>
             
        `)
        .addTo(map))
        



//icon


// map.on('load', () => {
//     // Load an image from an external URL.
//     map.loadImage(
//         'https://cdn-icons-png.flaticon.com/512/3293/3293413.png',
//         (error, image) => {
//             if (error) throw error;

//             // Add the image to the map style.
//             map.addImage('cat', image);

//             // Add a data source containing one point feature.
//             map.addSource('point', {
//                 'type': 'geojson',
//                 'data': {
//                     'type': 'FeatureCollection',
//                     'features': [
//                         {
//                             'type': 'Feature',
//                             'geometry': {
//                                 'type': 'Point',
//                                 'coordinates': coordinates
//                             }
//                         }
//                     ]
//                 }
//             });

//             // Add a layer to use the image to represent the data.
//             map.addLayer({
//                 'id': 'points',
//                 'type': 'symbol',
//                 'source': 'point', // reference the data source
//                 'layout': {
//                     'icon-image': 'cat', // reference the image
//                     'icon-size': 0.04
//                 }
//             });
//         }
//     );
// });




//animate


const size = 200;

// This implements `StyleImageInterface`
// to draw a pulsing dot icon on the map.
const pulsingDot = {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),

    // When the layer is added to the map,
    // get the rendering context for the map canvas.
    onAdd: function () {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
    },

    // Call once before every frame where the icon will be used.
    render: function () {
        const duration = 1000;
        const t = (performance.now() % duration) / duration;

        const radius = (size / 2) * 0.3;
        const outerRadius = (size / 2) * 0.7 * t + radius;
        const context = this.context;

        // Draw the outer circle.
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
        );
        context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
        context.fill();

        // Draw the inner circle.
        context.beginPath();
        context.arc(
            this.width / 2,
            this.height / 2,
            radius,
            0,
            Math.PI * 2
        );
        context.fillStyle = 'rgba(255, 100, 100, 1)';
        context.strokeStyle = 'white';
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // Update this image's data with data from the canvas.
        this.data = context.getImageData(
            0,
            0,
            this.width,
            this.height
        ).data;

        // Continuously repaint the map, resulting
        // in the smooth animation of the dot.
        map.triggerRepaint();

        // Return `true` to let the map know that the image was updated.
        return true;
    }
};

map.on('load', () => {
    map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

    map.addSource('dot-point', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': coordinates// icon position [lng, lat]
                    }
                }
            ]
        }
    });
    map.addLayer({
        'id': 'layer-with-pulsing-dot',
        'type': 'symbol',
        'source': 'dot-point',
        'layout': {
            'icon-image': 'pulsing-dot'
        }
    });


})















//popup


// const popup = new mapboxgl.Popup({ offset:25 })
//         .setLngLat(coordinates)
//         .setHTML('<h1>Hello World!</h1>')
//         .addTo(map);
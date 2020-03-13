import React, { Component, Fragment } from 'react';

import GoogleMap from './GoogleMap';

class Heatmap extends Component {
  constructor(props) {
    super(props);

    this.mapCenter = [43.6532, 97.3832]

    this.state = {
      places: [],
    };
  }

  async componentDidMount() {
    await fetch('./confirmed.json')
      .then(response => response.json())
      .then(data => this.setState({ places: data }));

  }

  render() {
    let { places } = this.state;
    
    places.forEach(el => el.date = new Date(el.date))
    const date = new Date('2020-03-08T05:00:00.000Z')
    places = places.filter(el => el.date.getTime() === date.getTime() && el.countryRegion === 'US')
    console.log('places', places)

    const data = places.map(place => ({
      lat: place.lat,
      lng: place.long,
      weight: place.numberOfCase,
    }));

    // console.log(data)
    const heatmapData = {
      positions: data,
      options: {
        radius: 50,
        opacity: 1,
        // intensity: 1000
      },
    };

    this.mapStyle =  [
        {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#263c3f'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#6b9a76'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#38414e'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{color: '#212a37'}]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9ca5b3'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#746855'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#1f2835'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: '#f3d19c'}]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{color: '#2f3948'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#17263c'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#515c6d'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#17263c'}]
        }
      ]

    return (
      <Fragment>
        { places && (
          <GoogleMap
            defaultZoom={1}
            defaultCenter={[43.6532, 79.3832]}
            heatmap={heatmapData}
            options={{ styles: this.mapStyle}}
            bootstrapURLKeys={{
              key: 'AIzaSyDz2FVeMnjK1FQ6T-gySuiyeOpAsZttt80',
              libraries: ['visualization'],
            }}
          />
        )}
      </Fragment>
    );
  }
}

export default Heatmap;
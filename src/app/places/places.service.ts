import { Injectable, signal } from '@angular/core';

import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);

  private async fetchPlaces(url: string):Promise<Place[]> {
    const response = await fetch(url);
  
    const payload = await response.json();

    return payload.places;
  }

  loadedUserPlaces = this.userPlaces.asReadonly();

  async loadAvailablePlaces() {
    return await this.fetchPlaces('http://localhost:3000/places');
  }

  async loadUserPlaces() {
    const places = await this.fetchPlaces('http://localhost:3000/user-places');
    this.userPlaces.set(places);
  }

  async addPlaceToUserPlaces(place: Place) {
    if(this.userPlaces().some(p => p.id === place.id)) {
      return;
    }

    const response = await fetch('http://localhost:3000/user-places', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        placeId: place.id
      })
    });

    const payload = await response.json();

    const places = payload.userPlaces;

    this.userPlaces.set(places);
  }

  async removeUserPlace(place: Place) {
    const response = await fetch(`http://localhost:3000/user-places/${place.id}`, {
      method: 'DELETE'
    });

    const payload = await response.json();

    const places = payload.userPlaces;

    this.userPlaces.set(places);
  }
}

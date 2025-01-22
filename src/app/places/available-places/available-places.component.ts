import { Component, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesService } from '../places.service';
import { ErrorService } from '../../shared/error.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  private placesService = inject(PlacesService);
  private errorService = inject(ErrorService);

  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  
  async loadPlaces() {
    try {
      this.isFetching.set(true);
      const places = await this.placesService.loadAvailablePlaces();
      this.places.set(places);
    } catch(err) {
      this.errorService.showError('Something went wrong fetching the available places. Please try again later.');
    } finally {
      this.isFetching.set(false);
    }
  }

  async onSelectPlace(selectedPlace: Place) {
    try {
      await this.placesService.addPlaceToUserPlaces(selectedPlace);
    } catch(err) {
      this.errorService.showError('Failed to store selected place');
    }
  }

  ngOnInit(): void {
    this.loadPlaces();
  }
}

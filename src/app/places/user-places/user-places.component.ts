import { Component, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { ErrorService } from '../../shared/error.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  private placesService = inject(PlacesService);
  private errorService = inject(ErrorService);

  places = this.placesService.loadedUserPlaces;
  isFetching = signal(false);
    
  async loadPlaces() {
    try {
      this.isFetching.set(true);
      await this.placesService.loadUserPlaces();
    } catch(err) {
      this.errorService.showError('Something went wrong fetching your favorite places. Please try again later.');
    } finally {
      this.isFetching.set(false);
    }
  }

  async onRemovePlace(place: Place) {
    try {
      await this.placesService.removeUserPlace(place);
    } catch(err) {
      this.errorService.showError('Failed to remove the selected place');
    }
  }

  ngOnInit(): void {
    this.loadPlaces();
  } 
}

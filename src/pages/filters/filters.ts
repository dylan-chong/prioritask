import { Component } from '@angular/core';
import { SettingsService } from '../../providers/settings-service/settings-service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'page-filters',
  templateUrl: 'filters.html',
})
export class FiltersPage {
  public filters: any = {};

  constructor(private settingsService: SettingsService) {
    settingsService.settings.first().subscribe(settings => {
      this.filters = cloneDeep(settings.filters);
    });
  }

  public saveFilterChange() {
    this.settingsService.updateSettings({ filters: this.filters })
  }
}


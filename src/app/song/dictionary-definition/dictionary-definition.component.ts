import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {MeaningScreen} from '../../models/MeaningScreen';
import {SongsService} from '../../services/songs.service';

@Component({
  selector: 'app-dictionary-definition',
  templateUrl: './dictionary-definition.component.html',
  styleUrls: ['./dictionary-definition.component.scss']
})
export class DictionaryDefinitionComponent implements OnInit {

  constructor(    public dialogRef: MatDialogRef<DictionaryDefinitionComponent>, public songsService: SongsService ) {



  }

  meaningScreen: MeaningScreen;

  ngOnInit() {
      this.meaningScreen = this.songsService.meaningScreen;
  }

  getEntries(map: Map<string, string>): [string, string] [] {
    if (map) {
      return Array.from(map.entries());
    } else {
      return [];
    }
  }

  close() {
    this.dialogRef.close() ;
  }

}

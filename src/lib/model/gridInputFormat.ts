export class GridInputFormat {

  constructor() {
  }

  public checkbox!: boolean;

  public noHeader: boolean = false;

  public rowHeight: number = 35;

  public pagination: boolean = false;
  public pageLimit: number = 10;

  public cascading: boolean = false;
  public cascadeLimit: number = 300;

  public ColorSettings: any[] = [];

  public isSpecific: boolean = false;
  public SpecificEntityName: string = "";

  public groupBy: string[] = [];
  public selectBy: string = 'id';

  public isEditable: boolean = false;

  public childConfiguration!: GridInputFormat;

  public entity: string = "";
  public includedProperties: any[] = [];
  public repeatInterval: number = 2;
  public isStartEndReport: boolean = false;

  public columnDefs: any[] = [];
  public CustomFields: any[] = [];
  public customColumns: any[] = [];
  public ActionColumnDef: any[] = [];

  public visibleColumnState: any[] = [];
  public VisibleColumnsList: any[] = [];

  public length: number = 0;
}
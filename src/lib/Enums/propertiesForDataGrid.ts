import { ConstString } from "./constString";


export class PropertiesForDataGrid {

    public static readonly OperatorTypeMapping = {
        "string": [ConstString.Equal, ConstString.NotEqual, ConstString.Contains],
        "number": [ConstString.Equal, ConstString.NotEqual, ConstString.LessThan, ConstString.LessThanOrEqual, ConstString.GreaterThan, ConstString.GreaterThanOrEqual],
        "category": [ConstString.Equal, ConstString.NotEqual],
    }

    public static readonly EventLogProperties = [
        {
          headerName: "AnalyticType", field: "AnalyticType", type: ConstString.String, cellRenderer: null, options: [{ name: 'ANPR', value: 'ANPR' }, { name: 'ATCC', value: 'ATCC' }], operators: [ConstString.Equal, ConstString.NotEqual], Querable: true, dataType: "text"
        },
        {
          headerName: "Device Name", field: "DeviceId", type: ConstString.String, cellRenderer: null, options: [], operators: [ConstString.Equal, ConstString.NotEqual], Querable: true, dataType: "text"
        },
        {
          headerName: "Event Time", field: "DetTime", type: ConstString.Date, cellRenderer: 'dateRendrer', options: null, operators: [ConstString.Equal, ConstString.NotEqual, ConstString.LessThan, ConstString.LessThanOrEqual, ConstString.GreaterThan, ConstString.GreaterThanOrEqual], Querable: true, dataType: "date"
        }
    ]

    public static readonly ResourceProperties = [
        {
            headerName: "ID", field: "id", type: ConstString.Number, cellRenderer: null, options: null, operators: [ConstString.Equal, ConstString.NotEqual, ConstString.LessThan, ConstString.LessThanOrEqual, ConstString.GreaterThan, ConstString.GreaterThanOrEqual], Querable: false, className: "Resources", dataType: "numeric"
        }, {
            headerName: "Resource Name", field: "resourceName", type: ConstString.String, cellRenderer: null, options: null, operators: [ConstString.Equal, ConstString.NotEqual], Querable: true, className: "Resources", dataType: "text"
        }, {
            headerName: "Resource Type", field: "resourceTypeName", type: ConstString.String, cellRenderer: null, options: null, operators: [ConstString.Equal, ConstString.NotEqual, ConstString.Contains], Querable: true, className: "Resources", dataType: "text"
        }, {
            headerName: "Longitude", field: "longitude", type: ConstString.Number, cellRenderer: null, operators: [ConstString.Equal, ConstString.NotEqual, ConstString.LessThan, ConstString.LessThanOrEqual, ConstString.GreaterThan, ConstString.GreaterThanOrEqual], Querable: true, className: "Resources", dataType: "numeric"
        }, {
            headerName: "Latitude", field: "latitude", type: ConstString.Number, cellRenderer: null, operators: [ConstString.Equal, ConstString.NotEqual, ConstString.LessThan, ConstString.LessThanOrEqual, ConstString.GreaterThan, ConstString.GreaterThanOrEqual], Querable: true, className: "Resources", dataType: "numeric"
        }, {
            headerName: "IP", field: "ip", type: ConstString.String, cellRenderer: null, options: null, operators: [ConstString.Equal, ConstString.NotEqual, ConstString.Contains], Querable: true, className: "Camera", dataType: "text"
        }, {
            headerName: "Live View Url", field: "liveViewUrl", type: ConstString.String, cellRenderer: null, options: null, operators: [ConstString.Equal, ConstString.NotEqual, ConstString.Contains], Querable: true, className: "Camera", dataType: "text"
        }, {
            headerName: "Is PTZ", field: "isPtz", type: ConstString.Boolean, cellRenderer: null, options: [{ name: "Yes", value: true }, { name: "No", value: false }], operators: [ConstString.Equal, ConstString.NotEqual], Querable: true, className: "Camera", dataType: "boolean"
        }, {
            headerName: "Field of View Angle", field: "fieldOfViewAngle", type: ConstString.Number, cellRenderer: null, options: null, operators: [ConstString.Equal, ConstString.NotEqual, ConstString.LessThan, ConstString.LessThanOrEqual, ConstString.GreaterThan, ConstString.GreaterThanOrEqual], Querable: true, className: "Camera", dataType: "numeric"
        }, {
            headerName: "Resource Angle", field: "resourceAngle", type: ConstString.Number, cellRenderer: null, options: null, operators: PropertiesForDataGrid.OperatorTypeMapping.number, Querable: true, className: "Resources", dataType: "numeric"
        }, {
            headerName: "Connection String", field: "connectionString", type: ConstString.String, cellRenderer: null, options: null, operators: PropertiesForDataGrid.OperatorTypeMapping.string, Querable: true, className: "Externalserver", dataType: "text"
        }, {
            headerName: "Type", field: "type", type: ConstString.Number, cellRenderer: null, options: [{ name: 'General', value: 0 }, { name: 'i2v_VMS', value: 1 }], operators: [ConstString.Equal, ConstString.NotEqual], Querable: true, className: "Externalserver", dataType: "category"
        },{
            headerName: "Layer Name", field: "layerName", type: ConstString.String, cellRenderer: null, options: null, operators: [ConstString.Equal, ConstString.NotEqual], Querable: true, className: "Resources", dataType: "text"
        },{
            headerName: "Area ID", field: "areaId", type: ConstString.Number, cellRenderer: null, options: null, operators: [ConstString.Equal, ConstString.NotEqual, ConstString.LessThan, ConstString.LessThanOrEqual, ConstString.GreaterThan, ConstString.GreaterThanOrEqual], Querable: false, className: "Resources", dataType: "numeric"
        }, {
            headerName: "Dvr Id", field: "dVRId", type: ConstString.Number, cellRenderer: null, options: null, operators: [ConstString.Equal, ConstString.NotEqual, ConstString.LessThan, ConstString.LessThanOrEqual, ConstString.GreaterThan, ConstString.GreaterThanOrEqual], Querable: false, className: "Resources", dataType: "numeric"
        }, { 
            headerName: "Pipe Line Video Sources", field: "pipleLineVideoSources", type: ConstString.String, cellRenderer: null, options: null, operators: [ConstString.Equal, ConstString.NotEqual], Querable: true, className: "", dataType: "text" 
        }, {
            headerName: "Processing Height", field: "processignHeight", type: ConstString.Number, cellRenderer: null, operators: [ConstString.Equal, ConstString.NotEqual, ConstString.LessThan, ConstString.LessThanOrEqual, ConstString.GreaterThan, ConstString.GreaterThanOrEqual], Querable: true, className: "", dataType: "numeric"
        }, {
            headerName: "Processing Width", field: "processingWidth", type: ConstString.Number, cellRenderer: null, operators: [ConstString.Equal, ConstString.NotEqual, ConstString.LessThan, ConstString.LessThanOrEqual, ConstString.GreaterThan, ConstString.GreaterThanOrEqual], Querable: true, className: "", dataType: "numeric"
        }, {
            headerName: "Url", field: "url", type: ConstString.String, cellRenderer: null, options: null, operators: PropertiesForDataGrid.OperatorTypeMapping.string, Querable: true, className: "", dataType: "text"
        }, {
            headerName: "User Video Sources", field: "userVideoSources", type: ConstString.String, cellRenderer: null, options: null, operators: [ConstString.Equal, ConstString.NotEqual], Querable: true, className: "", dataType: "text" 
        },         
    ]

    public static readonly ActionProperties = [
        // {
        // headerName: "Device Name", field: "VideoSourceId", type: ConstString.String, cellRenderer: null, options: [], operators: [ConstString.Equal, ConstString.NotEqual], Querable: true, dataType: "text"
        // },
        // {
        //   headerName: "Event Time", field: "DetTime", type: ConstString.Date, cellRenderer: 'dateRendrer', options: null, operators: [ConstString.Equal, ConstString.NotEqual, ConstString.LessThan, ConstString.LessThanOrEqual, ConstString.GreaterThan, ConstString.GreaterThanOrEqual], Querable: true, dataType: "date"
        // },
        {
          headerName: "Name", field: "EventProperties.personName", type: ConstString.String, cellRenderer: null, options: null, operators: [ConstString.Equal, ConstString.NotEqual], Querable: true, dataType: "text"
        },
        {
          headerName: "Label", field: "EventProperties.label", type: ConstString.String, cellRenderer: null, options: null, operators: [ConstString.Equal, ConstString.NotEqual], Querable: true, dataType: "text"
        }
    ]



}


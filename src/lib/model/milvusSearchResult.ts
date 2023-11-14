

    export interface Status {
    }

    export interface LongData {
        data: number[];
    }

    export interface Data {
        longData: LongData;
    }

    export interface Scalars {
        data: Data;
    }

    export interface Field {
        scalars: Scalars;
    }

    export interface FieldsData {
        type: number;
        field_name: string;
        field: Field;
        field_id: number;
    }

    export interface IdField {
        intId?: any;
    }

    export interface Ids {
        idField: IdField;
    }

    export interface Results {
        num_queries: number;
        top_k: number;
        fields_data: FieldsData[];
        scores: number[];
        ids: Ids;
        topks: number[];
    }

    export interface SearchResult {
        status: Status;
        results: Results;
        collection_name: string;
        refrenceImage?: string;
    }

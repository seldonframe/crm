export type EntityLabel = {
  singular: string;
  plural: string;
};

export type PipelineStageConfig = {
  name: string;
  color: string;
  probability: number;
};

export type CustomFieldConfig = {
  key: string;
  label: string;
  type: string;
  options?: string[];
};

export interface FrameworkConfig {
  appName: string;
  appDescription: string;
  logo: string;
  entities: {
    contact: EntityLabel;
    deal: EntityLabel;
    activity: EntityLabel;
    pipeline: EntityLabel;
  };
  defaultPipeline: {
    name: string;
    stages: PipelineStageConfig[];
  };
  defaultCustomFields: {
    contact: CustomFieldConfig[];
    deal: CustomFieldConfig[];
  };
  features: {
    deals: boolean;
    intakeForms: boolean;
    aiFeatures: boolean;
    soulSystem: boolean;
    import: boolean;
    export: boolean;
    webhooks: boolean;
    api: boolean;
  };
  contactStatuses: string[];
  activityTypes: string[];
}

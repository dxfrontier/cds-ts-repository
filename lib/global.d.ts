// Loads the `@sap/cds` type augmentation and the global cds.ql APIs (SELECT, INSERT, UPDATE, DELETE, UPSERT).
// As of @sap/cds 10 these types are provided by the separate `@cap-js/cds-types` package and are no longer
// wired automatically (the `@types/sap__cds` symlink is not created on install), so we reference them explicitly.
/// <reference types="@cap-js/cds-types" />

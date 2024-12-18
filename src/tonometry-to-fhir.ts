import {Observation} from "@fhir-typescript/r4b-core/dist/fhir/Observation";
import {Coding, CodingArgs} from "@fhir-typescript/r4b-core/dist/fhir/Coding";
import {TonometryComponent} from "./tonometry-component.ts";
import {TonometrieData} from "./tonometryData.ts";
import {customElement} from "lit/decorators.js";

export function uiModel2Fhir(tonometry: TonometrieData): Observation[] {
    let obs = new Observation({
        resourceType: "Observation",
        code: {
            coding: [snomed("asb", "fsad")]
        },
        effectiveDateTime: tonometry.recordedDate,
        bodySite: {
            coding: [snomed("362502000",  "Entire right eye (body structure)")]
        },
        valueQuantity: {
            value: tonometry.rightEye.pressure,
            unit: "mm[Hg]",
            system: "http://unitsofmeasure.org",
            code: "mm[Hg]"
        }
    })

    return [obs.toJSON(), obs.toJSON()];
}

export function snomed(code: string, display: string): CodingArgs {
    return {"system": "http://snomed.info/sct", code, display}
}

export function loinc(code: string, display: string): CodingArgs {
    return {"system": "\"http://loinc.org\"", code, display}
}
import {Observation} from "@fhir-typescript/r4b-core/dist/fhir/Observation";
import {Coding, CodingArgs} from "@fhir-typescript/r4b-core/dist/fhir/Coding";
import {TonometryComponent} from "./tonometry-component.ts";
import {TonometrieData} from "./tonometryData.ts";
import {customElement} from "lit/decorators.js";

export function uiModel2Fhir(tonometry: TonometrieData): Observation[] {
    let left = new Observation({
        resourceType: "Observation",
        category: [
            {coding: [{system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam"}]}
        ],
        code: {
            coding: [snomed("41633001", "Intraocular pressure")]
        },
        effectiveDateTime: tonometry.recordedDate,
        bodySite: {
            coding: [snomed("362503005",  "Entire left eye (body structure)")]
        },
        valueQuantity: {
            value: tonometry.leftEye.pressure,
            unit: "mm[Hg]",
            system: "http://unitsofmeasure.org",
            code: "mm[Hg]"
        },
        method: {
            coding: [snomed("252803002", "Applanation tonometry")]
        }
    })

    let right = new Observation({
        resourceType: "Observation",
        category: [
            {coding: [{system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam"}]}
        ],
        code: {
            coding: [snomed("41633001", "Intraocular pressure")]
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

    return [left.toJSON(), right.toJSON()];
}

export function snomed(code: string, display: string): CodingArgs {
    return {"system": "http://snomed.info/sct", code, display};
}

export function loinc(code: string, display: string): CodingArgs {
    return {"system": "http://loinc.org", code, display};
}

/**
 *
 * 1,6;1,25;1,0;0,8;0,7;0,63;0,5;0,4;0,32;0,25;0,2;0,16;0,125;0,1;0,08;0,05
 * 1/10;1/15;1/20;1/25;1/35;1/50
 * FZ, HBW, LS, NL
 *
 *
 *
 * Mehrere Spalten im DropDown für den Visus
 */
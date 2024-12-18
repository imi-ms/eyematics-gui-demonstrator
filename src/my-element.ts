import {LitElement, css, html} from 'lit'
import {customElement, property, state} from 'lit/decorators.js'
import litLogo from './assets/lit.svg'
import viteLogo from '/vite.svg'
import {bulmaStyles} from "./bulma-styles.ts";
import { classMap } from 'lit/directives/class-map.js';
import {TonometrieData} from "./tonometryData.ts";
import {TonometryComponent} from "./tonometry-component.ts";
import {ColumnConfig, FhirTableRenderer} from "./fhir-table-renderer.ts";
import {uiModel2Fhir} from "./tonometry-to-fhir.ts";
import {Observation} from "@fhir-typescript/r4b-core/dist/fhir/Observation";

@customElement('my-element')
export class MyElement extends LitElement {

    @state()
    protected activeTab = "tonometryTab"

    @state()
    private tonometryData: Observation[] = [];

    private columnMap:ColumnConfig<TonometrieData> = {
        'Messzeitpunkt': "Observation.effectiveDateTime",
        'Auge': "Observation.bodySite.coding",
        'Tonometrie Typ': "Observation.value",
        'Augeninnendruck': "Observation.value",
        'Linkes Auge (Aufgetropft)': "Observation"
    };

    render() {
        //do not treeshake
        new TonometryComponent()
        new FhirTableRenderer()

        return html`
            <div class="tabs is-medium">
                <ul>
                    <li class="${classMap({'is-active' : this.activeTab === 'tonometryTab'})}" @click=${this._onClick}
                        id="tonometryTab"><a>Augeninnendruck</a></li>
                    <li class="${classMap({'is-active' :  this.activeTab === 'visusTab'})}" @click=${this._onClick}
                        id="visusTab"><a>Visus</a></li>
                </ul>
            </div>

            <tonometry-component  @add-observation="${this._handleAdd}" ></tonometry-component>
            
            <fhir-table-renderer id="table" .columnMap="${this.columnMap}" .data="${this.tonometryData}"></fhir-table-renderer>
        `
    }


    private _onClick(e: Event) {
        console.log(e.currentTarget);
        this.activeTab = e.currentTarget.id
        console.log(this.activeTab)
    }


    private _handleAdd(e: CustomEvent<TonometrieData>) {
        console.log("handleAdd", e);
        this.tonometryData = [...this.tonometryData, ...uiModel2Fhir(e.detail)];
        console.log("tonometryData", this.tonometryData);

    }

    private _handleSubmit(e: Event) {
        console.log(this.formData);
    }


    static styles = [
        bulmaStyles
    ]
}


declare global {
    interface HTMLElementTagNameMap {
        'my-element': MyElement,
        'tonometry-component': TonometryComponent,
        'fhir-table-renderer': FhirTableRenderer<TonometrieData>
    }
}

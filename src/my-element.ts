import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import litLogo from "./assets/lit.svg";
import viteLogo from "/vite.svg";
import { bulmaStyles } from "./bulma-styles.ts";
import { classMap } from "lit/directives/class-map.js";
import { TonometrieData } from "./tonometryData.ts";
import { TonometryComponent } from "./tonometry-component.ts";
import { ColumnConfig, FhirTableRenderer } from "./fhir-table-renderer.ts";
import { uiModel2Fhir } from "./tonometry-to-fhir.ts";
import { Observation } from "@fhir-typescript/r4b-core/dist/fhir/Observation";
import { VisusComponent } from "./visus-component.ts";

@customElement("my-element")
export class MyElement extends LitElement {
	@state()
	protected activeTab = "tonometryTab";

	@state()
	private tonometryData: Observation[] = [];
	private visusData: Observation[] = [];

	private columnMapTonometry: ColumnConfig<TonometrieData> = {
		Messzeitpunkt: "Observation.effectiveDateTime",
		Seitigkeit: "Observation.bodySite.coding",
		Code: "Observation.code.coding",
		"Tonometrie Typ": "Observation.value",
		Augeninnendruck: "Observation.valueQuantity.value",
		Einheit: "Observation.valueQuantity.unit",
	};

	private columnMapVisus: ColumnConfig<TonometrieData> = {
		Messzeitpunkt: "Observation.effectiveDateTime",
		Seitigkeit: "Observation.bodySite.coding",
		Code: "Observation.code.coding",
	};

	render() {
		//do not treeshake
		new TonometryComponent();
		new FhirTableRenderer();
		new VisusComponent();

		return html`
			<div class="tabs is-medium">
				<ul>
					<li
						class="${classMap({ "is-active": this.activeTab === "tonometryTab" })}"
						@click=${this._onClick}
						id="tonometryTab"
					>
						<a>Augeninnendruck</a>
					</li>
					<li
						class="${classMap({ "is-active": this.activeTab === "visusTab" })}"
						@click=${this._onClick}
						id="visusTab"
					>
						<a>Visus</a>
					</li>
				</ul>
			</div>

			${this.activeTab == "tonometryTab"
				? html`<tonometry-component @add-observation="${this._handleAdd}"></tonometry-component>`
				: html`<visus-component @add-observation="${this._handleAdd}"></visus-component>`}
			${this.activeTab == "tonometryTab"
				? html`<fhir-table-renderer
						id="table"
						.columnMap="${this.columnMapTonometry}"
						.data="${this.tonometryData}"
				  ></fhir-table-renderer>`
				: html`<fhir-table-renderer
						id="table"
						.columnMap="${this.columnMapVisus}"
						.data="${this.visusData}"
				  ></fhir-table-renderer>`}
		`;
	}

	private _onClick(e: Event) {
		this.activeTab = (e.currentTarget as Element).id;
	}

	private _handleAdd(e: CustomEvent<TonometrieData>) {
		this.tonometryData = [...this.tonometryData, ...uiModel2Fhir(e.detail)];
	}

	private _handleSubmit(e: Event) {}

	static styles = [bulmaStyles];
}

declare global {
	interface HTMLElementTagNameMap {
		"my-element": MyElement;
		"tonometry-component": TonometryComponent;
		"fhir-table-renderer": FhirTableRenderer<TonometrieData>;
	}
}

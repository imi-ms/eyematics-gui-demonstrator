import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { bulmaStyles } from "./bulma-styles.ts";
import { classMap } from "lit/directives/class-map.js";
import { TonometrieData } from "./tonometryData.ts";
import { TonometryComponent } from "./tonometry-component.ts";
import { ColumnConfig, FhirTableRenderer } from "./fhir-table-renderer.ts";
import { tonometry2Fhir } from "./tonometry-to-fhir.ts";
import { visus2Fhir } from "./visus-to-fhir.ts";
import { Observation } from "@fhir-typescript/r4b-core/dist/fhir/Observation";
import { VisusComponent } from "./visus-component.ts";
import { VisusData } from "./VisusData.ts";

@customElement("my-element")
export class MyElement extends LitElement {
	@state()
	protected activeTab = "tonometryTab";

	@state()
	private tonometryData: Observation[] = [];

	@state()
	private visusData: Observation[] = [];

	private columnMapTonometry: ColumnConfig<TonometrieData> = {
		Messzeitpunkt: "Observation.effective",
		Seitigkeit: "Observation.bodySite.coding",
		Code: "Observation.code.coding",
		"Tonometrie Typ": "Observation.method.coding",
		Augeninnendruck: "Observation.value",
		Einheit: "Observation.value.unit",
	};

	private columnMapVisus: ColumnConfig<VisusData> = {
		Messzeitpunkt: "Observation.effective",
		Seitigkeit: "Observation.bodySite.coding",
		Code: "Observation.code.coding",
		Visus: "iif(Observation.value.coding.exists(), Observation.value.coding, Observation.value)",
		Korrektion:
			"Observation.component.where(code.coding.code.value in ('29073-4' | '29074-2')).select(value.coding | extension)",
		Testentfernung: "Observation.component.where(code.coding.code.value='252124009').value.coding",
		Optotyp: "Observation.component.where(code.coding.code.value='VS_VA_Optotypes').value.coding",
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
						.columnMap="${this.columnMapTonometry}"
						.data="${this.tonometryData}"
				  ></fhir-table-renderer>`
				: html`<fhir-table-renderer
						.columnMap="${this.columnMapVisus}"
						.data="${this.visusData}"
				  ></fhir-table-renderer>`}
		`;
	}

	private _onClick(e: Event) {
		this.activeTab = (e.currentTarget as Element).id;
	}

	private _handleAdd(e: CustomEvent) {
		this.activeTab == "tonometryTab"
			? (this.tonometryData = [...this.tonometryData, ...tonometry2Fhir(e.detail)])
			: (this.visusData = [...this.visusData, ...visus2Fhir(e.detail)]);
	}

	private _handleSubmit(e: Event) {}

	static styles = [bulmaStyles];
}

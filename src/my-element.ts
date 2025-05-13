import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { bulmaStyles } from "./bulma-styles.ts";
import { classMap } from "lit/directives/class-map.js";
import { TonometrieData } from "./tonometry-data.ts";
import { TonometryComponent } from "./tonometry-component.ts";
import { ColumnConfig, FhirTableRenderer } from "./fhir-table-renderer.ts";
import { tonometry2Fhir } from "./tonometry-to-fhir.ts";
import { visus2Fhir } from "./visus-to-fhir.ts";
import { Observation } from "@fhir-typescript/r4b-core/dist/fhir/Observation";
import { VisusComponent } from "./visus-component.ts";
import { VisusData } from "./visus-data.ts";
import { FunduscopyComponent } from "./funduscopy-component.ts";
import { funduscopy2Fhir } from "./funduscopy-to-fhir.ts";
import { Bundle } from "@fhir-typescript/r4b-core/dist/fhir/Bundle";
import { FunduscopyData } from "./funduscopy-data.ts";
import { OCTData } from "./oct-data.ts";
import { OCTComponent } from "./oct-component.ts";
import { oct2Fhir } from "./oct-to-fhir.ts";
import { AnteriorChamberComponent } from "./anterior-chamber-component.ts";
import { anteriorChamber2Fhir } from "./anterior-chamber-to-fhir.ts";
import { IVIComponent } from "./ivi-component.ts";
import { ivi2Fhir } from "./ivi-to-fhir.ts";
import { AnteriorChamberData } from "./anterior-chamber-data.ts";
import { IVIData } from "./ivi-data.ts";

@customElement("my-element")
export class MyElement extends LitElement {
	@state()
	protected activeTab = "tonometryTab";

	@state()
	private tonometryData: Observation[] = [];

	@state()
	private visusData: Observation[] = [];

	@state()
	private iviData: Bundle[] = [];

	@state()
	private anteriorChamberData: Bundle[] = [];

	@state()
	private funduscopyData: Bundle[] = [];

	@state()
	private octData: Bundle[] = [];

	private columnMapTonometry: ColumnConfig<TonometrieData> = {
		Messzeitpunkt: "Observation.effective",
		Seitigkeit: "Observation.bodySite.coding",
		Code: "Observation.code.coding",
		"Tonometrie Typ": "Observation.method.coding",
		Augeninnendruck: "Observation.value",
		Einheit: "Observation.value.unit",
		Mydriasis: "Observation.component.where(code.coding.code.value='37125009').value.coding",
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
		Mydriasis: "Observation.component.where(code.coding.code.value='37125009').value.coding",
		"Stenopäische Lücke": "Observation.component.where(code.coding.code.value='257492003').value.coding",
	};

	private columnMapIVI: ColumnConfig<IVIData> = {
		Verordnungszeitpunkt: "Bundle.entry.resource.authoredOn",
		Seitigkeit: "Bundle.entry.resource.dosageInstruction.site.coding",
		Medikament: "Bundle.entry.resource.where(resourceType='Medication').code.text",
		Intervall: "Bundle.entry.resource.dosageInstruction.timing.repeat",
		note: "Bundle.entry.resource.note.text.value",
	};

	private columnMapAnteriorChamber: ColumnConfig<AnteriorChamberData> = {
		Diagnosezeitpunkt: "Bundle.entry.resource.effective[0]",
		Seitigkeit: "Bundle.entry.resource.bodySite.coding[0]",
		Code: "Bundle.entry.resource.code.coding",
		Status: "Bundle.entry.resource.value.coding",
		Befunde: "Bundle.entry.resource.where(resourceType='DiagnosticReport').conclusion",
	};

	private columnMapFunduscopy: ColumnConfig<FunduscopyData> = {
		Diagnosezeitpunkt: "Bundle.entry.resource.effective[0]",
		Seitigkeit: "Bundle.entry.resource.bodySite.coding[0]",
		Code: "Bundle.entry.resource.code.coding",
		Status: "Bundle.entry.resource.value.coding",
		Befunde: "Bundle.entry.resource.where(resourceType='DiagnosticReport').conclusion",
	};

	private columnMapOCT: ColumnConfig<OCTData> = {
		Messzeitpunkt: "Bundle.entry.resource.effective[0]",
		Seitigkeit: "Bundle.entry.resource.bodySite.coding[0]",
		Code: "Bundle.entry.resource.code.coding",
		Messung: "Bundle.entry.resource.value",
		Einheit: "Bundle.entry.resource.value.unit",
	};

	render() {
		//do not treeshake
		new TonometryComponent();
		new VisusComponent();
		new IVIComponent();
		new AnteriorChamberComponent();
		new FunduscopyComponent();
		new OCTComponent();
		new FhirTableRenderer();

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
					<li
						class="${classMap({ "is-active": this.activeTab === "iviTab" })}"
						@click=${this._onClick}
						id="iviTab"
					>
						<a>IVOM</a>
					</li>
					<li
						class="${classMap({ "is-active": this.activeTab === "anteriorChamberTab" })}"
						@click=${this._onClick}
						id="anteriorChamberTab"
					>
						<a>Vorderkammer</a>
					</li>
					<li
						class="${classMap({ "is-active": this.activeTab === "funduscopyTab" })}"
						@click=${this._onClick}
						id="funduscopyTab"
					>
						<a>Funduskopie</a>
					</li>
					<li
						class="${classMap({ "is-active": this.activeTab === "octTab" })}"
						@click=${this._onClick}
						id="octTab"
					>
						<a>OCT</a>
					</li>
				</ul>
			</div>

			${this._renderTabs()}
		`;
	}

	private _renderTabs() {
		if (this.activeTab == "tonometryTab") {
			return html` <tonometry-component @add-observation="${this._handleAdd}"></tonometry-component>
				<fhir-table-renderer
					.columnMap="${this.columnMapTonometry}"
					.data="${this.tonometryData}"
				></fhir-table-renderer>`;
		} else if (this.activeTab == "visusTab") {
			return html` <visus-component @add-observation="${this._handleAdd}"></visus-component>
				<fhir-table-renderer
					.columnMap="${this.columnMapVisus}"
					.data="${this.visusData}"
				></fhir-table-renderer>`;
		} else if (this.activeTab == "iviTab") {
			return html` <ivi-component @add-observation="${this._handleAdd}"></ivi-component>
				<fhir-table-renderer .columnMap="${this.columnMapIVI}" .data="${this.iviData}"></fhir-table-renderer>`;
		} else if (this.activeTab == "anteriorChamberTab") {
			return html` <anterior-chamber-component @add-observation="${this._handleAdd}"></anterior-chamber-component>
				<fhir-table-renderer
					.columnMap="${this.columnMapAnteriorChamber}"
					.data="${this.anteriorChamberData}"
				></fhir-table-renderer>`;
		} else if (this.activeTab == "funduscopyTab") {
			return html` <funduscopy-component @add-observation="${this._handleAdd}"></funduscopy-component>
				<fhir-table-renderer
					.columnMap="${this.columnMapFunduscopy}"
					.data="${this.funduscopyData}"
				></fhir-table-renderer>`;
		} else if (this.activeTab == "octTab") {
			return html` <oct-component @add-observation="${this._handleAdd}"></oct-component>
				<fhir-table-renderer .columnMap="${this.columnMapOCT}" .data="${this.octData}"></fhir-table-renderer>`;
		}
	}

	private _onClick(e: Event) {
		this.activeTab = (e.currentTarget as Element).id;
	}

	private async _handleAdd(e: CustomEvent) {
		if (this.activeTab == "tonometryTab") {
			this.tonometryData = [...this.tonometryData, ...tonometry2Fhir(e.detail)];
		} else if (this.activeTab == "visusTab") {
			this.visusData = [...this.visusData, ...visus2Fhir(e.detail)];
		} else if (this.activeTab == "iviTab") {
			this.iviData = [...this.iviData, ...(await ivi2Fhir(e.detail))];
		} else if (this.activeTab == "anteriorChamberTab") {
			this.anteriorChamberData = [...this.anteriorChamberData, ...anteriorChamber2Fhir(e.detail)];
		} else if (this.activeTab == "funduscopyTab") {
			this.funduscopyData = [...this.funduscopyData, ...funduscopy2Fhir(e.detail)];
		} else if (this.activeTab == "octTab") {
			this.octData = [...this.octData, ...oct2Fhir(e.detail)];
		}
	}

	private _handleSubmit(e: Event) {}

	static styles = [bulmaStyles];
}

import { customElement, state } from "lit/decorators.js";
import { css, html, LitElement } from "lit";
import { bulmaStyles } from "./bulma-styles.ts";
import { VisusData, CorrectionMethod, TestDistance, Optotype } from "./visus-data.ts";
import { getNumberOrNull } from "./tonometry-component.ts";

const visusValues = [
	"1,6",
	"1,25",
	"1,0",
	"0,8",
	"0,7",
	"0,63",
	"0,5",
	"0,4",
	"0,32",
	"0,25",
	"0,2",
	"0,16",
	"0,125",
	"0,1",
	"0,08",
	"0,05",
	"1/10",
	"1/15",
	"1/20",
	"1/25",
	"1/35",
	"1/50",
	"FZ",
	"HBW",
	"LS",
	"NL",
];

const mainOptotypes = Object.entries(Optotype).slice(0, 3);
const extraOptotypes = Object.entries(Optotype).slice(3);

@customElement("visus-component")
export class VisusComponent extends LitElement {
	@state()
	private formData: VisusData = {
		recordedDate: new Date().toISOString().slice(0, 16),
		correctionMethod: CorrectionMethod.Glasses,
		testDistance: TestDistance.Far,
		optotype: Optotype.Numbers,
		rightEye: {
			lens: {
				sphere: null,
				cylinder: null,
				axis: null,
			},
			visus: "",
			mydriasis: false,
			pinhole: false,
		},
		leftEye: {
			lens: {
				sphere: null,
				cylinder: null,
				axis: null,
			},
			visus: "",
			mydriasis: false,
			pinhole: false,
		},
	};

	@state()
	private validInput: boolean = false;

	@state()
	private validationMessage: string = "";

	@state()
	private expandOptotype = false;

	render() {
		this._validateInput();

		return html`
            <section class="section visus-container">
                <div class="container">
                    <!-- Header -->
                    <div class="field">
                        <label class="label is-medium">
                            <strong>Visus:</strong>
                        </label>
                        <div class="field is-grouped">
                            <div class="control">
                                    <input 
                                            class="recordedDate input is-small" 
                                            type="datetime-local" 
                                            placeholder="Messzeitpunkt (Default: Jetzt)"
                                            .value="${this.formData.recordedDate}"
											@input="${this._updateFormData}"
                                    />
                            </div>
                            <div class="control">
                                <div class="select is-small">
                                    <select class="correctionMethod" @change="${this._updateFormData}">
                                    ${Object.entries(CorrectionMethod).map(
										([key, value]) => html`
											<option
												value="${key}"
												?selected=${this.formData.correctionMethod === value}
											>
												${value}
											</option>
										`
									)}
                                    </select>
                                </div>
                            </div>
                            <div class="control">
                                <div class="select is-small">
                                    <select class="testDistance" @change="${this._updateFormData}">
                                    ${Object.entries(TestDistance).map(
										([key, value]) => html`
											<option value="${key}" ?selected=${this.formData.testDistance === value}>
												${value}
											</option>
										`
									)}
                                    </select>
                                </div>
                            </div>
                            <div class="control">
                                <div class="select is-small">
									<select class="optotype" @change="${(e: Event) => {
										let element = e.target as HTMLSelectElement;
										let value = element.value;

										if (!["more", "less"].includes(value)) {
											this._updateFormData();
											return;
										}

										this.expandOptotype = value === "more";
										setTimeout(() => element.showPicker(), 100);
									}}">
										${mainOptotypes.map(
											([key, value]) => html`
												<option value="${key}" ?selected=${this.formData.optotype === value}>
													${value}
												</option>
											`
										)}
										${
											!this.expandOptotype
												? html`<option value="more">See More ↓</option>`
												: html`
														${extraOptotypes.map(
															([key, value]) => html`
																<option value="${key}">${value}</option>
															`
														)}
														<option value="less">See less ↑</option>
												  `
										}
									</select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right and Left Eye Fields -->
                    <div class="horizontal-fields">
                        <!-- Right Eye -->
                        <div class="box">
                            <div class="field-label">Rechtes Auge</div>
                            <div class="inputs-inline">
                                <input
									class="sphere-right input is-small is-small-input"
									type="number"
									placeholder="Sphäre"
									step="0.25"
									@input="${this._updateFormData}"
								/>
                                <input
									class="cylinder-right input is-small is-small-input"
									type="number"
									placeholder="Zylinder"
									step="0.25"
									@input="${this._updateFormData}"
								/>
                                <input
									class="axis-right input is-small is-small-input"
									type="number"
									placeholder="Achse"
									min="0"
									max="180"
									@input="${this._updateFormData}"
								/>
                            </div>
                            <div class="inputs-inline">
								<div class="field has-addons is-narrow">
									<div class="visus-input control">
										<div class="visus-input select is-small">
											<select class="visus-right" required @change="${this._updateFormData}">
												<option value="" disabled selected hidden>Visus</option>
												${visusValues.map((value) => html` <option value="${value}">${value}</option> `)}
											</select>
										</div>
									</div>
									${this._renderVisusSuffix(this.formData.rightEye.visus)}
								</div>
                            </div>
							<div class="inputs-inline">
								<label class="checkbox">
                                    <input class="mydriasis-right" type="checkbox" @input="${this._updateFormData}"/>
                                    <span class="checkbox-label"> Mydriasis</span>
                                </label>
								<label class="checkbox">
                                    <input class="pinhole-right" type="checkbox" @input="${this._updateFormData}"/>
                                    <span class="checkbox-label"> Stenop.</span>
                                </label>
							</div>
                        </div>

                        <!-- Left Eye -->
                        <div class="box">
                            <div class="field-label">Linkes Auge</div>
                            <div class="inputs-inline">
                                <input
									class="sphere-left input is-small is-small-input"
									type="number"
									placeholder="Sphäre"
									step="0.25"
									@input="${this._updateFormData}"
								/>
                                <input
									class="cylinder-left input is-small is-small-input"
									type="number"
									placeholder="Zylinder"
									step="0.25"
									@input="${this._updateFormData}"
								/>
                                <input
									class="axis-left input is-small is-small-input"
									type="number"
									placeholder="Achse"
									min="0"
									max="180"
									@input="${this._updateFormData}"
								/>
                            </div>
                            <div class="inputs-inline">
								<div class="field has-addons is-narrow">
									<div class="visus-input control">
										<div class="visus-input select is-small">
											<select class="visus-left" required @change="${this._updateFormData}">
												<option value="" disabled selected hidden>Visus</option>
												${visusValues.map((value) => html` <option value="${value}">${value}</option> `)}
											</select>
										</div>
									</div>
									${this._renderVisusSuffix(this.formData.leftEye.visus)}
								</div>
                            </div>
							<div class="inputs-inline">
								<label class="checkbox">
                                    <input class="mydriasis-left" type="checkbox" @input="${this._updateFormData}"/>
                                    <span class="checkbox-label"> Mydriasis</span>
                                </label>
								<label class="checkbox">
                                    <input class="pinhole-left" type="checkbox" @input="${this._updateFormData}"/>
                                    <span class="checkbox-label"> Stenop.</span>
                                </label>
							</div>
                        </div>
                    </div>
                    <button
						class="submit button is-primary"
						?disabled="${!this.validInput}"
						title="${this.validationMessage}"
						@click="${this._handleSubmit}"
					>
						Erfassen
					</button>
            </section>
        `;
	}

	private _renderVisusSuffix(visus: string) {
		if (visus.includes(".") || visus.includes(",")) {
			return html`<p class="button is-static is-small">dec</p>`;
		}

		if (visus.includes("/")) {
			return html`<p class="button is-static is-small">m</p>`;
		}

		return null;
	}

	private _updateFormData() {
		this.formData = {
			recordedDate: this.renderRoot.querySelector<HTMLInputElement>(".recordedDate")?.value,
			correctionMethod:
				CorrectionMethod[this.renderRoot.querySelector<HTMLSelectElement>(".correctionMethod")?.value],
			testDistance: TestDistance[this.renderRoot.querySelector<HTMLSelectElement>(".testDistance")?.value],
			optotype: Optotype[this.renderRoot.querySelector<HTMLSelectElement>(".optotype")?.value],
			rightEye: {
				lens: {
					sphere: getNumberOrNull(this.renderRoot, ".sphere-right"),
					cylinder: getNumberOrNull(this.renderRoot, ".cylinder-right"),
					axis: getNumberOrNull(this.renderRoot, ".axis-right"),
				},
				visus: this.renderRoot.querySelector<HTMLSelectElement>(".visus-right")?.value,
				mydriasis: this.renderRoot.querySelector<HTMLInputElement>(".mydriasis-right")?.checked,
				pinhole: this.renderRoot.querySelector<HTMLInputElement>(".pinhole-right")?.checked,
			},
			leftEye: {
				lens: {
					sphere: getNumberOrNull(this.renderRoot, ".sphere-left"),
					cylinder: getNumberOrNull(this.renderRoot, ".cylinder-left"),
					axis: getNumberOrNull(this.renderRoot, ".axis-left"),
				},
				visus: this.renderRoot.querySelector<HTMLSelectElement>(".visus-left")?.value,
				mydriasis: this.renderRoot.querySelector<HTMLInputElement>(".mydriasis-left")?.checked,
				pinhole: this.renderRoot.querySelector<HTMLInputElement>(".pinhole-left")?.checked,
			},
		};
	}

	private _validateInput() {
		this.validInput = true;
		this.validationMessage = "";

		let visusData: [string, string][] = [
			[this.formData.leftEye.visus, "linke"],
			[this.formData.rightEye.visus, "rechte"],
		];

		for (let [visus, label] of visusData) {
			if (visus === "") {
				this.validInput = false;
				this.validationMessage += `Bitte geben Sie einen Visuswert für das ${label} Auge an.\n`;
			}
		}

		if (this.formData.correctionMethod === CorrectionMethod.Uncorrected) {
			return;
		}

		let lensData: [{ sphere: number; cylinder: number; axis: number }, string][] = [
			[this.formData.leftEye.lens, "linke"],
			[this.formData.rightEye.lens, "rechte"],
		];

		for (let [lens, label] of lensData) {
			if (lens.sphere == null) {
				this.validInput = false;
				this.validationMessage += `Bitte geben Sie einen Sphärenwert für das ${label} Auge an.\n`;
			} else if (!this._isDivisibleByQuarter(lens.sphere)) {
				this.validInput = false;
				this.validationMessage += `Bitte geben Sie einen gültigen Sphärenwert für das ${label} Auge an.\n`;
			}

			if (lens.cylinder == null) {
				this.validInput = false;
				this.validationMessage += `Bitte geben Sie einen Zylinderwert für das ${label} Auge an.\n`;
			} else if (!this._isDivisibleByQuarter(lens.cylinder)) {
				this.validInput = false;
				this.validationMessage += `Bitte geben Sie einen gültigen Zylinderwert für das ${label} Auge an.\n`;
			}

			if (lens.axis == null) {
				this.validInput = false;
				this.validationMessage += `Bitte geben Sie einen Achsenwert für das ${label} Auge an.\n`;
			} else if (lens.axis < 0 || lens.axis > 180) {
				this.validInput = false;
				this.validationMessage += `Der Achsenwert für das ${label} Auge muss zwischen 0° und 180° liegen.\n`;
			}
		}
	}

	private _isDivisibleByQuarter(num: number): boolean {
		let decimals = Math.abs(num % 1);
		return decimals === 0 || decimals === 0.25 || decimals === 0.5 || decimals === 0.75;
	}

	private _handleSubmit(_: Event) {
		const event = new CustomEvent("add-observation", {
			detail: this.formData,
			bubbles: false, // Allow the event to bubble up
			composed: true, // Allow the event to cross shadow DOM boundaries
		});

		this.dispatchEvent(event);
	}

	static styles = [
		bulmaStyles,
		css`
			.visus-container {
				margin: 1rem auto;
				max-width: 800px;
			}

			.visus-input select {
				width: 10em;
			}
			.visus-input select:invalid {
				color: gray;
			}

			.field-label {
				font-weight: bold;
				text-align: center;
			}

			.horizontal-fields {
				display: flex;
				justify-content: space-between;
				margin: 0.75em;
			}

			.horizontal-fields .box {
				width: 45%;
				margin-bottom: 0;
			}

			.inputs-inline {
				display: flex;
				gap: 0.5rem;
				margin-bottom: 0.75rem;
			}

			.is-small-input {
				width: 30%;
			}
		`,
	];
}

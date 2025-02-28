import { customElement, state } from "lit/decorators.js";
import { css, html, LitElement } from "lit";
import { bulmaStyles } from "./bulma-styles.ts";
import { VisusData, CorrectionMethod, TestDistance, Optotype } from "./VisusData.ts";

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

@customElement("visus-component")
export class VisusComponent extends LitElement {
	@state()
	private formData: VisusData = {
		recordedDate: new Date().toISOString().slice(0, 16),
		correctionMethod: CorrectionMethod.Glasses,
		testDistance: TestDistance.Far,
		optotype: Optotype.Landolt,
		rightEye: {
			lens: {
				sphere: -1.0,
				cylinder: -1.0,
				axis: 70,
			},
			visus: "0,2",
		},
		leftEye: {
			lens: {
				sphere: 0.25,
				cylinder: -0.75,
				axis: 60,
			},
			visus: "FZ",
		},
	};

	render() {
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
                                    >
                            </div>
                            <div class="control">
                                <div class="select is-small">
                                    <select class="correctionMethod">
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
                                    <select class="testDistance">
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
                                    <select class="optotype">
                                    ${Object.entries(Optotype).map(
										([key, value]) => html`
											<option value="${key}" ?selected=${this.formData.optotype === value}>
												${value}
											</option>
										`
									)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right and Left Eye Fields -->
                    <div class="horizontal-fields">
                        <!-- Right Eye -->
                        <div class="box">
                            <div class="field-label">rechtes Auge</div>
                            <div class="inputs-inline">
                                <input
									class="sphere-right input is-small is-small-input"
									type="number"
									placeholder="sphere"
								/>
                                <input
									class="cylinder-right input is-small is-small-input"
									type="number"
									placeholder="cylinder"
								/>
                                <input
									class="axis-right input is-small is-small-input"
									type="number"
									placeholder="axis"
								/>
                            </div>
                            <div class="inputs-inline">
                                <div class="visus-input control">
                                    <div class="visus-input select is-small">
                                        <select class="visus-right" required>
                                            <option value="" disabled selected hidden>Visus</option>
                                            ${visusValues.map(
												(value) => html` <option value="${value}">${value}</option> `
											)}
                                        </select>
                                    </div>
                                </div>
								<label class="checkbox">
                                    <input type="checkbox" />
                                    <span class="checkbox-label"> Stenop.</span>
                                </label>
                            </div>
                        </div>

                        <!-- Left Eye -->
                        <div class="box">
                            <div class="field-label">linkes Auge</div>
                            <div class="inputs-inline">
                                <input
									class="sphere-left input is-small is-small-input"
									type="number"
									placeholder="sphere"
								/>
                                <input
									class="cylinder-left input is-small is-small-input"
									type="number"
									placeholder="cylinder"
								/>
                                <input
									class="axis-left input is-small is-small-input"
									type="number"
									placeholder="axis"
								/>
                            </div>
                            <div class="inputs-inline">
                                <div class="visus-input control">
                                    <div class="visus-input select is-small">
                                        <select class="visus-left" required>
                                            <option value="" disabled selected hidden>Visus</option>
                                            ${visusValues.map(
												(value) => html` <option value="${value}">${value}</option> `
											)}
                                        </select>
                                    </div>
                                </div>
								<label class="checkbox">
                                    <input type="checkbox" />
                                    <span class="checkbox-label"> Stenop.</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <button class="button is-primary" @click="${this._handleSubmit}">Erfassen</button>
            </section>
        `;
	}

	private getFormData(): VisusData {
		return {
			recordedDate:
				this.renderRoot.querySelector<HTMLInputElement>(".recordedDate")?.value || this.formData.recordedDate,
			correctionMethod:
				(this.renderRoot.querySelector<HTMLSelectElement>(".correctionMethod")?.value as CorrectionMethod) ||
				this.formData.correctionMethod,
			testDistance:
				(this.renderRoot.querySelector<HTMLSelectElement>(".testDistance")?.value as TestDistance) ||
				this.formData.testDistance,
			optotype:
				(this.renderRoot.querySelector<HTMLSelectElement>(".optotype")?.value as Optotype) ||
				this.formData.optotype,
			rightEye: {
				lens: {
					sphere:
						Number(this.renderRoot.querySelector<HTMLInputElement>(".sphere-right")?.value) ||
						this.formData.rightEye.lens.sphere,
					cylinder:
						Number(this.renderRoot.querySelector<HTMLInputElement>(".cylinder-right")?.value) ||
						this.formData.rightEye.lens.cylinder,
					axis:
						Number(this.renderRoot.querySelector<HTMLInputElement>(".axis-right")?.value) ||
						this.formData.rightEye.lens.axis,
				},
				visus:
					this.renderRoot.querySelector<HTMLSelectElement>(".visus-right")?.value ||
					this.formData.rightEye.visus,
			},
			leftEye: {
				lens: {
					sphere:
						Number(this.renderRoot.querySelector<HTMLInputElement>(".sphere-left")?.value) ||
						this.formData.leftEye.lens.sphere,
					cylinder:
						Number(this.renderRoot.querySelector<HTMLInputElement>(".cylinder-left")?.value) ||
						this.formData.leftEye.lens.cylinder,
					axis:
						Number(this.renderRoot.querySelector<HTMLInputElement>(".axis-left")?.value) ||
						this.formData.leftEye.lens.axis,
				},
				visus:
					this.renderRoot.querySelector<HTMLSelectElement>(".visus-left")?.value ||
					this.formData.leftEye.visus,
			},
		};
	}

	private _handleSubmit(_: Event) {
		const event = new CustomEvent("add-observation", {
			detail: this.getFormData(),
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

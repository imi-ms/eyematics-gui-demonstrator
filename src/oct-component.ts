import { customElement, state } from "lit/decorators.js";
import { css, html, LitElement } from "lit";
import { bulmaStyles } from "./bulma-styles.ts";
import { MacularMap, OCTData, RNFLMap } from "./oct-data.ts";
import { getNumberOrNull } from "./tonometry-component.ts";
import * as dicomParser from "dicom-parser";

@customElement("oct-component")
export class OCTComponent extends LitElement {
	@state()
	private formData: OCTData = {
		recordedDate: new Date().toISOString().slice(0, 16),
		rightEye: {
			retinalThickness: {
				value: null,
				position: MacularMap.CenterPoint,
			},
			opticDiscDiameter: {
				value: null,
			},
			rnflThickness: {
				value: null,
				position: RNFLMap.RInfTemp,
			},
			dicomData: {
				url: null,
				manufacturer: null,
				modelName: null,
				softwareVersions: null,
			},
		},
		leftEye: {
			retinalThickness: {
				value: null,
				position: MacularMap.CenterPoint,
			},
			opticDiscDiameter: {
				value: null,
			},
			rnflThickness: {
				value: null,
				position: RNFLMap.RInfTemp,
			},
			dicomData: {
				url: null,
				manufacturer: null,
				modelName: null,
				softwareVersions: null,
			},
		},
	};

	@state()
	private validInput: boolean = false;

	@state()
	private validationMessage: string = "";

	render() {
		this._validateInput();

		return html`
            <section class="section oct-container">
                <div class="container">
                    <!-- Header -->
                    <div class="field">
                        <label class="label is-medium">
                            <strong>OCT:</strong>
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
                        </div>
                    </div>

                    <!-- Right and Left Eye Fields -->
                    <div class="horizontal-fields">
                        <!-- Right Eye -->
                        <div class="box">
                            <div class="field-label">Rechtes Auge</div>
                            <div class="inputs-inline">
								<div class="field has-addons is-narrow">
									<input
										class="retinal-thickness-right input is-small"
										type="number"
										placeholder="Netzhautdicke"
										min="0"
										@input="${this._updateFormData}"
									/>
									<p class="button is-static is-small">µm</p>
								</div>
                                <div class="control">
                                    <div class="select is-small">
                                        <select class="macular-map-right" @change="${this._updateFormData}">
                                        ${Object.entries(MacularMap).map(
											([key, value]) => html`
												<option
													value="${key}"
													?selected=${this.formData.rightEye.retinalThickness.position ===
													value}
												>
													${value}
												</option>
											`
										)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="inputs-inline">
								<div class="field has-addons is-narrow">
									<input
										class="optic-disc-diameter-right input is-small"
										type="number"
										placeholder="Durchmesser Papillenscan"
										min="0"
										@input="${this._updateFormData}"
									/>
									<p class="button is-static is-small">mm</p>
								</div>
                            </div>
                            <div class="inputs-inline">
								<div class="field has-addons is-narrow">
									<input
										class="rnfl-thickness-right input is-small"
										type="number"
										placeholder="RNFL Dicke"
										min="0"
										@input="${this._updateFormData}"
									/>
									<p class="button is-static is-small">µm</p>
								</div>
                                <div class="control">
                                    <div class="select is-small">
                                        <select class="rnfl-map-right" @change="${this._updateFormData}">
                                        ${Object.entries(RNFLMap).map(
											([key, value]) => html`
												<option
													value="${key}"
													?selected=${this.formData.rightEye.rnflThickness.position === value}
												>
													${value}
												</option>
											`
										)}
                                        </select>
                                    </div>
                                </div>
                            </div>
							<div class="control">
                                <input class="dicom-file-right" type="file" accept=".DCM" @change="${
									this._updateFormData
								}" />
                            </div>
                        </div>

                        <!-- Left Eye -->
                        <div class="box">
                            <div class="field-label">Linkes Auge</div>
                            <div class="inputs-inline">
								<div class="field has-addons is-narrow">
									<input
										class="retinal-thickness-left input is-small"
										type="number"
										placeholder="Netzhautdicke"
										min="0"
										@input="${this._updateFormData}"
									/>
									<p class="button is-static is-small">µm</p>
								</div>
                                <div class="control">
                                    <div class="select is-small">
                                        <select class="macular-map-left" @change="${this._updateFormData}">
                                        ${Object.entries(MacularMap).map(
											([key, value]) => html`
												<option
													value="${key}"
													?selected=${this.formData.leftEye.retinalThickness.position ===
													value}
												>
													${value}
												</option>
											`
										)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="inputs-inline">
								<div class="field has-addons is-narrow">
									<input
										class="optic-disc-diameter-left input is-small"
										type="number"
										placeholder="Durchmesser Papillenscan"
										min="0"
										@input="${this._updateFormData}"
									/>
									<p class="button is-static is-small">mm</p>
								</div>
                            </div>
                            <div class="inputs-inline">
								<div class="field has-addons is-narrow">
									<input
										class="rnfl-thickness-left input is-small"
										type="number"
										placeholder="RNFL Dicke"
										min="0"
										@input="${this._updateFormData}"
									/>
									<p class="button is-static is-small">µm</p>
								</div>
                                <div class="control">
                                    <div class="select is-small">
                                        <select class="rnfl-map-left" @change="${this._updateFormData}">
                                        ${Object.entries(RNFLMap).map(
											([key, value]) => html`
												<option
													value="${key}"
													?selected=${this.formData.leftEye.rnflThickness.position === value}
												>
													${value}
												</option>
											`
										)}
                                        </select>
                                    </div>
                                </div>
                            </div>
							<div class="control">
                                <input class="dicom-file-left" type="file" accept=".DCM" @change="${
									this._updateFormData
								}" />
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

	private async _updateFormData() {
		this.formData = {
			recordedDate: this.renderRoot.querySelector<HTMLInputElement>(".recordedDate")?.value,
			rightEye: {
				retinalThickness: {
					value: getNumberOrNull(this.renderRoot, ".retinal-thickness-right"),
					position: MacularMap[this.renderRoot.querySelector<HTMLSelectElement>(".macular-map-right")?.value],
				},
				opticDiscDiameter: { value: getNumberOrNull(this.renderRoot, ".optic-disc-diameter-right") },
				rnflThickness: {
					value: getNumberOrNull(this.renderRoot, ".rnfl-thickness-right"),
					position: RNFLMap[this.renderRoot.querySelector<HTMLSelectElement>(".rnfl-map-right")?.value],
				},
				dicomData: await this._getDICOMData(".dicom-file-right"),
			},
			leftEye: {
				retinalThickness: {
					value: getNumberOrNull(this.renderRoot, ".retinal-thickness-left"),
					position: MacularMap[this.renderRoot.querySelector<HTMLSelectElement>(".macular-map-left")?.value],
				},
				opticDiscDiameter: { value: getNumberOrNull(this.renderRoot, ".optic-disc-diameter-left") },
				rnflThickness: {
					value: getNumberOrNull(this.renderRoot, ".rnfl-thickness-left"),
					position: RNFLMap[this.renderRoot.querySelector<HTMLSelectElement>(".rnfl-map-left")?.value],
				},
				dicomData: await this._getDICOMData(".dicom-file-left"),
			},
		};
	}

	private async _getDICOMData(className: string) {
		let dicomData = {
			url: null,
			manufacturer: null,
			modelName: null,
			softwareVersions: null,
		};

		let input = this.renderRoot.querySelector<HTMLInputElement>(className);

		if (input.files && input.files.length > 0) {
			let file = input.files[0];

			dicomData.url = file.name;

			let arrayBuffer = await file.arrayBuffer();
			let dataSet = dicomParser.parseDicom(new Uint8Array(arrayBuffer));

			dicomData.manufacturer = dataSet.string("x00080070");
			dicomData.modelName = dataSet.string("x00081090");
			dicomData.softwareVersions = dataSet.string("x00181020");
		}

		return dicomData;
	}

	private _validateInput() {
		this.validInput = true;
		this.validationMessage = "";

		let octData: [number, string, string][] = [
			[this.formData.leftEye.retinalThickness.value, "die zentrale Netzhautdicke", "linke"],
			[this.formData.leftEye.opticDiscDiameter.value, "den Papillendurchmesser", "linke"],
			[this.formData.leftEye.rnflThickness.value, "die RNFL Dicke im Sektor G", "linke"],
			[this.formData.rightEye.retinalThickness.value, "die zentrale Netzhautdicke", "rechte"],
			[this.formData.rightEye.opticDiscDiameter.value, "den Papillendurchmesser", "rechte"],
			[this.formData.rightEye.rnflThickness.value, "die RNFL Dicke im Sektor G", "rechte"],
		];

		for (let [measurement, finding, sideness] of octData) {
			if (measurement == null) {
				this.validInput = false;
				this.validationMessage += `Bitte geben Sie ${finding} für das ${sideness} Auge an.\n`;
			} else if (measurement < 0) {
				this.validInput = false;
				this.validationMessage += `Bitte geben Sie für ${finding} am ${sideness}n Auge einen positiven Wert an.\n`;
			}
		}

		let dicomData: [{ url: string; manufacturer: string; modelName: string; softwareVersions: string }, string][] =
			[
				[this.formData.leftEye.dicomData, "linke"],
				[this.formData.rightEye.dicomData, "rechte"],
			];

		for (let [data, sideness] of dicomData) {
			for (let value of Object.values(data)) {
				if (value == null) {
					// this.validInput = false;
					this.validationMessage += `Bitte fügen Sie das OCT-Bild im DICOM-Format für das ${sideness} Auge bei.\n`;
					break;
				}
			}
		}
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
			.oct-container {
				margin: 1rem auto;
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
				margin-bottom: 0;
				margin: 1em;
			}

			.inputs-inline {
				display: flex;
				gap: 0.5rem;
				margin-bottom: 0.75rem;
			}

			.inputs-inline .field {
				display: flex;
				margin-bottom: 0.75rem;
				flex: 1;
			}

			.is-small-input {
				width: 30%;
			}
		`,
	];
}

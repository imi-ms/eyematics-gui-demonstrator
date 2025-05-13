import { customElement, state } from "lit/decorators.js";
import { css, html, LitElement } from "lit";
import { bulmaStyles } from "./bulma-styles.ts";
import { AnteriorChamberData, SUNCells, SUNFlare } from "./anterior-chamber-data.ts";
import { PresenceStatus } from "./funduscopy-data.ts";
import { getPresenceStatus } from "./funduscopy-component.ts";

@customElement("anterior-chamber-component")
export class AnteriorChamberComponent extends LitElement {
	@state()
	private formData: AnteriorChamberData = {
		recordedDate: new Date().toISOString().slice(0, 16),
		rightEye: {
			cells: null,
			flare: null,
			synechiae: PresenceStatus.Unknown,
			note: "",
		},
		leftEye: {
			cells: null,
			flare: null,
			synechiae: PresenceStatus.Unknown,
			note: "",
		},
	};

	@state()
	private validInput: boolean = false;

	@state()
	private validationMessage: string = "";

	render() {
		this._validateInput();

		return html`
            <section class="section anterior-chamber-container">
                <div class="container">
                    <!-- Header -->
                    <div class="field">
                        <label class="label is-medium">
                            <strong>Vorderkammer:</strong>
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
                                <div class="anterior-chamber-input control">
                                    <div class="anterior-chamber-input select is-small">
                                        <select class="cells-right" required @change="${this._updateFormData}">
                                            <option value="" disabled selected hidden>Vorderkammerzellen</option>
                                            ${Object.entries(SUNCells).map(
												([key, value]) => html`
													<option
														value="${key}"
														?selected=${this.formData.rightEye.cells === value}
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
                                <div class="anterior-chamber-input control">
                                    <div class="anterior-chamber-input select is-small">
                                        <select class="flare-right" required @change="${this._updateFormData}">
                                            <option value="" disabled selected hidden>Tyndall-Reaktion</option>
                                            ${Object.entries(SUNFlare).map(
												([key, value]) => html`
													<option
														value="${key}"
														?selected=${this.formData.rightEye.flare === value}
													>
														${value}
													</option>
												`
											)}
                                        </select>
                                    </div>
                                </div>
                            </div>
							<label class="label">Liegen Synechien vor?</label>
                            <div class="inputs-inline">
                                <label class="radio">
                                    <input
                                        type="radio"
                                        name="synechiae-right"
                                        value="Present"
                                        @input="${this._updateFormData}"
                                    />
                                    <span class="checkbox-label">Ja</span>
                                </label>
                                <label class="radio">
                                    <input
                                        type="radio"
                                        name="synechiae-right"
                                        value="Absent"
                                        @input="${this._updateFormData}"
                                    />
                                    <span class="checkbox-label">Nein</span>
                                </label>
                            </div>
                            <label class="label">Zusätzliche Befunde:</label>
                            <div class="field">
                                <div class="control">
                                    <textarea
                                        class="note-right textarea is-small"
                                        placeholder="Freitext für das rechtes Auge"
                                        @input="${this._updateFormData}"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- Left Eye -->
                        <div class="box">
                            <div class="field-label">Linkes Auge</div>
                            <div class="inputs-inline">
                                <div class="anterior-chamber-input control">
                                    <div class="anterior-chamber-input select is-small">
                                        <select class="cells-left" required @change="${this._updateFormData}">
                                            <option value="" disabled selected hidden>Vorderkammerzellen</option>
                                            ${Object.entries(SUNCells).map(
												([key, value]) => html`
													<option
														value="${key}"
														?selected=${this.formData.leftEye.cells === value}
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
                                <div class="anterior-chamber-input control">
                                    <div class="anterior-chamber-input select is-small">
                                        <select class="flare-left" required @change="${this._updateFormData}">
                                            <option value="" disabled selected hidden>Tyndall-Reaktion</option>
                                            ${Object.entries(SUNFlare).map(
												([key, value]) => html`
													<option
														value="${key}"
														?selected=${this.formData.leftEye.flare === value}
													>
														${value}
													</option>
												`
											)}
                                        </select>
                                    </div>
                                </div>
                            </div>
							<label class="label">Liegen Synechien vor?</label>
                            <div class="inputs-inline">
                                <label class="radio">
                                    <input
                                        type="radio"
                                        name="synechiae-left"
                                        value="Present"
                                        @input="${this._updateFormData}"
                                    />
                                    <span class="checkbox-label">Ja</span>
                                </label>
                                <label class="radio">
                                    <input
                                        type="radio"
                                        name="synechiae-left"
                                        value="Absent"
                                        @input="${this._updateFormData}"
                                    />
                                    <span class="checkbox-label">Nein</span>
                                </label>
                            </div>
                            <label class="label">Zusätzliche Befunde:</label>
                            <div class="field">
                                <div class="control">
                                    <textarea
                                        class="note-left textarea is-small"
                                        placeholder="Freitext für das linkes Auge"
                                        @input="${this._updateFormData}"
                                    ></textarea>
                                </div>
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

	private _updateFormData() {
		this.formData = {
			recordedDate: this.renderRoot.querySelector<HTMLInputElement>(".recordedDate")?.value,
			rightEye: {
				cells: SUNCells[this.renderRoot.querySelector<HTMLSelectElement>(".cells-right")?.value],
				flare: SUNFlare[this.renderRoot.querySelector<HTMLSelectElement>(".flare-right")?.value],
				synechiae: getPresenceStatus(this.renderRoot, "synechiae-right"),
				note: this.renderRoot.querySelector<HTMLInputElement>(".note-right")?.value,
			},
			leftEye: {
				cells: SUNCells[this.renderRoot.querySelector<HTMLSelectElement>(".cells-left")?.value],
				flare: SUNFlare[this.renderRoot.querySelector<HTMLSelectElement>(".flare-left")?.value],
				synechiae: getPresenceStatus(this.renderRoot, "synechiae-left"),
				note: this.renderRoot.querySelector<HTMLInputElement>(".note-left")?.value,
			},
		};
	}

	private _validateInput() {
		this.validInput = true;
		this.validationMessage = "";

		let anteriorChamberData: [string, string, string][] = [
			[this.formData.leftEye.cells, "Vorderkammerzellen", "linke"],
			[this.formData.leftEye.flare, "Tyndall-Reaktion", "linke"],
			[this.formData.rightEye.cells, "Vorderkammerzellen", "rechte"],
			[this.formData.rightEye.flare, "Tyndall-Reaktion", "rechte"],
		];

		for (let [value, finding, sideness] of anteriorChamberData) {
			if (!value) {
				this.validInput = false;
				this.validationMessage += `Bitte wählen Sie für das ${sideness} Auge einen Wert für die ${finding} aus.\n`;
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
			.anterior-chamber-container {
				margin: 1rem auto;
				max-width: 800px;
			}

			.anterior-chamber-input select:invalid {
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

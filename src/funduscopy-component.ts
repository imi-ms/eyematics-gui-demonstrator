import { customElement, state } from "lit/decorators.js";
import { css, html, LitElement } from "lit";
import { bulmaStyles } from "./bulma-styles.ts";
import { PresenceStatus, FunduscopyData } from "./funduscopyData.ts";

@customElement("funduscopy-component")
export class FunduscopyComponent extends LitElement {
	@state()
	private formData: FunduscopyData = {
		recordedDate: new Date().toISOString().slice(0, 16),
		rightEye: {
			papillEdema: PresenceStatus.Unknown,
			macularEdema: PresenceStatus.Unknown,
			vascuitis: PresenceStatus.Unknown,
		},
		leftEye: {
			papillEdema: PresenceStatus.Unknown,
			macularEdema: PresenceStatus.Unknown,
			vascuitis: PresenceStatus.Unknown,
		},
	};

	@state()
	private validInput: boolean = false;

	@state()
	private validationMessage: string = "";

	render() {
		this._validateInput();

		return html`
            <section class="section funduscopy-container">
                <div class="container">
                    <!-- Header -->
                    <div class="field">
                        <label class="label is-medium">
                            <strong>Funduskopie:</strong>
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
                            <label class="label">Papillenschwellung vorhanden?</label>
                            <div class="inputs-inline">
                                <label class="radio">
                                    <input
                                        type="radio"
                                        name="papillEdema-right"
                                        value="Present"
                                        @input="${this._updateFormData}"
                                    />
                                    <span class="a-label">Ja</span>
                                </label>
                                <label class="radio">
                                    <input
                                        type="radio"
                                        name="papillEdema-right"
                                        value="Absent"
                                        @input="${this._updateFormData}"
                                    />
                                    <span class="checkbox-label">Nein</span>
                                </label>
                            </div>
                            <label class="label">Makulaödem vorhanden?</label>
                            <div class="inputs-inline">
                                <label class="radio">
                                    <input
                                        type="radio"
                                        name="macularEdema-right"
                                        value="Present"
                                        @input="${this._updateFormData}"
                                    />
                                    <span class="a-label">Ja</span>
                                </label>
                                <label class="radio">
                                    <input
                                        type="radio"
                                        name="macularEdema-right"
                                        value="Absent"
                                        @input="${this._updateFormData}"
                                    />
                                    <span class="checkbox-label">Nein</span>
                                </label>
                            </div>
                            <label class="label">Vaskulitiszeichen vorhanden?</label>
                            <div class="inputs-inline">
                                <label class="radio">
                                    <input
                                        type="radio"
                                        name="vascuitis-right"
                                        value="Present"
                                        @input="${this._updateFormData}"
                                    />
                                    <span class="a-label">Ja</span>
                                </label>
                                <label class="radio">
                                    <input
                                        type="radio"
                                        name="vascuitis-right"
                                        value="Absent"
                                        @input="${this._updateFormData}"
                                    />
                                    <span class="checkbox-label">Nein</span>
                                </label>
                            </div>
                        </div>

                        <!-- Left Eye -->
                        <div class="box">
                            <div class="field-label">Linkes Auge</div>
                            <label class="label">Papillenschwellung vorhanden?</label>
                            <div class="inputs-inline">
                                <label class="radio">
                                    <input
                                        type="radio"
                                        name="papillEdema-left"
                                        value="Present"
                                        @input="${this._updateFormData}"
                                    />
                                    <span class="a-label">Ja</span>
                                </label>
                                <label class="radio">
                                    <input
                                        type="radio"
                                        name="papillEdema-left"
                                        value="Absent"
                                        @input="${this._updateFormData}"
                                    />
                                    <span class="checkbox-label">Nein</span>
                                </label>
                            </div>
                            <label class="label">Makulaödem vorhanden?</label>
                            <div class="inputs-inline">
                                <label class="radio">
                                    <input
                                        type="radio"
                                        name="macularEdema-left"
                                        value="Present"
                                        @input="${this._updateFormData}"
                                    />
                                    <span class="a-label">Ja</span>
                                </label>
                                <label class="radio">
                                    <input
                                        type="radio"
                                        name="macularEdema-left"
                                        value="Absent"
                                        @input="${this._updateFormData}"
                                    />
                                    <span class="checkbox-label">Nein</span>
                                </label>
                            </div>
                            <label class="label">Vaskulitiszeichen vorhanden?</label>
                            <div class="inputs-inline">
                                <label class="radio">
                                    <input
                                        type="radio"
                                        name="vascuitis-left"
                                        value="Present"
                                        @input="${this._updateFormData}"
                                    />
                                    <span class="a-label">Ja</span>
                                </label>
                                <label class="radio">
                                    <input
                                        type="radio"
                                        name="vascuitis-left"
                                        value="Absent"
                                        @input="${this._updateFormData}"
                                    />
                                    <span class="checkbox-label">Nein</span>
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

	private _updateFormData() {
		this.formData = {
			recordedDate: this.renderRoot.querySelector<HTMLInputElement>(".recordedDate")?.value,
			rightEye: {
				papillEdema: this._getPresenceStatus("papillEdema-right"),
				macularEdema: this._getPresenceStatus("macularEdema-right"),
				vascuitis: this._getPresenceStatus("vascuitis-right"),
			},
			leftEye: {
				papillEdema: this._getPresenceStatus("papillEdema-left"),
				macularEdema: this._getPresenceStatus("macularEdema-left"),
				vascuitis: this._getPresenceStatus("vascuitis-left"),
			},
		};
	}

	private _getPresenceStatus(name: string) {
		let result = this.shadowRoot.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
		return result ? PresenceStatus[result.value] : PresenceStatus.Unknown;
	}

	private _validateInput() {
		this.validInput = true;
		this.validationMessage = "";

		let funduscopyData: [PresenceStatus, string, string][] = [
			[this.formData.leftEye.papillEdema, "eine Papillenschwellung", "linken"],
			[this.formData.leftEye.macularEdema, "ein Makulaödem", "linken"],
			[this.formData.leftEye.vascuitis, "ein Vaskulitiszeichen", "linken"],
			[this.formData.rightEye.papillEdema, "eine Papillenschwellung", "rechten"],
			[this.formData.rightEye.macularEdema, "ein Makulaödem", "rechten"],
			[this.formData.rightEye.vascuitis, "ein Vaskulitiszeichen", "rechten"],
		];

		for (let [status, finding, sideness] of funduscopyData) {
			if (status === PresenceStatus.Unknown) {
				this.validInput = false;
				this.validationMessage += `Bitte geben Sie an, ob ${finding} am ${sideness} Auge vorhanden ist oder nicht.\n`;
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
			.funduscopy-container {
				margin: 1rem auto;
				max-width: 1000px;
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

import { customElement, state } from "lit/decorators.js";
import { css, html, LitElement } from "lit";
import { bulmaStyles } from "./bulma-styles.ts";
import { IOPMethod, TonometrieData } from "./tonometryData.ts";

@customElement("visus-component")
export class VisusComponent extends LitElement {
	@state()
	private formData: TonometrieData = {
		tonometryType: IOPMethod.Applanation,
		recordedDate: new Date().toISOString().slice(0, 16),
		rightEye: { pressure: 18, isDropped: false },
		leftEye: { pressure: 20, isDropped: false },
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
                                            class="input is-small" 
                                            type="datetime-local" 
                                            placeholder="Messzeitpunkt (Default: Jetzt)"
                                            .value="${this.formData.recordedDate}"
                                    >
                            </div>
                            <div class="control">
                                <div class="select is-small">
                                    <select>
                                        <option>Ohne Korrektur (s.c.)</option>
                                        <option>Subjektive Korrektur</option>
                                        <option>Autorefraktometer Korrektur</option>
                                        <option>Brille</option>
                                    </select>
                                </div>
                            </div>
                            <div class="control">
                                <div class="select is-small">
                                    <select>
                                        <option>Fern</option>
                                        <option>Intermediär</option>
                                        <option>Nah</option>
                                        <option>Unbekannt</option>
                                    </select>
                                </div>
                            </div>
                            <div class="control">
                                <div class="select is-small">
                                    <select>
                                        <option>Landolt</option>
                                        <option>Snellen</option>
                                        <option>Zahlen</option>
                                        <option>Buchstaben</option>
                                        <option>Bilder</option>
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
                                <input class="input is-small is-small-input" type="number" placeholder="sph" />
                                <input class="input is-small is-small-input" type="number" placeholder="cyl" />
                                <input class="input is-small is-small-input" type="number" placeholder="axis" />
                            </div>
                            <div class="inputs-inline">
                                <div class="visus-input control">
                                    <div class="visus-input select is-small">
                                        <select required>
                                            <option value="" disabled selected hidden>Visus</option>
                                            <option>1,6</option>
                                            <option>1,25</option>
                                            <option>1,0</option>
                                            <option>0,8</option>
                                            <option>0,7</option>
                                            <option>0,63</option>
                                            <option>0,5</option>
                                            <option>0,4</option>
                                            <option>0,32</option>
                                            <option>0,25</option>
                                            <option>0,2</option>
                                            <option>0,16</option>
                                            <option>0,125</option>
                                            <option>0,1</option>
                                            <option>0,08</option>
                                            <option>0,05</option>
                                            <option>1/10</option>
                                            <option>1/15</option>
                                            <option>1/20</option>
                                            <option>1/25</option>
                                            <option>1/35</option>
                                            <option>1/50</option>
                                            <option>FZ</option>
                                            <option>HBW</option>
                                            <option>LS</option>
                                            <option>NL</option>
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
                                <input class="input is-small is-small-input" type="number" placeholder="sph" />
                                <input class="input is-small is-small-input" type="number" placeholder="cyl" />
                                <input class="input is-small is-small-input" type="number" placeholder="axis" />
                            </div>
                            <div class="inputs-inline">
                                <div class="visus-input control">
                                    <div class="visus-input select is-small">
                                        <select required>
                                            <option value="" disabled selected hidden>Visus</option>
                                            <option>1,6</option>
                                            <option>1,25</option>
                                            <option>1,0</option>
                                            <option>0,8</option>
                                            <option>0,7</option>
                                            <option>0,63</option>
                                            <option>0,5</option>
                                            <option>0,4</option>
                                            <option>0,32</option>
                                            <option>0,25</option>
                                            <option>0,2</option>
                                            <option>0,16</option>
                                            <option>0,125</option>
                                            <option>0,1</option>
                                            <option>0,08</option>
                                            <option>0,05</option>
                                            <option>1/10</option>
                                            <option>1/15</option>
                                            <option>1/20</option>
                                            <option>1/25</option>
                                            <option>1/35</option>
                                            <option>1/50</option>
                                            <option>FZ</option>
                                            <option>HBW</option>
                                            <option>LS</option>
                                            <option>NL</option>
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

	private getFormData(): TonometrieData {
		return this.formData;
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

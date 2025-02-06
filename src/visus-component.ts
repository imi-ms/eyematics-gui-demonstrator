import {customElement, state} from "lit/decorators.js";
import {css, html, LitElement} from "lit";
import {bulmaStyles} from "./bulma-styles.ts";
import {TonometrieData} from "./tonometryData.ts";

@customElement('visus-component')
export class VisusComponent extends LitElement {


    @state()
    private formData: TonometrieData = {
        tonometryType: 'applanatorisch',
        recordedDate: new Date().toISOString().slice(0, 16),
        rightEye: { pressure: 18, isDropped: false },
        leftEye: { pressure: 20, isDropped: false },
    };

    render() {
        return html` <section class="section visus-container">
            <!-- Header -->
            <div class="field">
                <label class="label is-medium">
                    <strong>Visus:</strong>
                </label>
                <div class="field is-grouped">
                    <div class="control">
                        <input class="input is-small" type="datetime-local" placeholder="Messzeitpunkt (Default)"/>
                    </div>
                    <div class="control">
                        <div class="select is-small">
                            <select>
                                <option>Art der Korrektur</option>
                                <option>Brille</option>
                                <option>Kontaktlinsen</option>
                            </select>
                        </div>
                    </div>
                    <div class="control">
                        <div class="select is-small">
                            <select>
                                <option>Distanz</option>
                                <option>Nah</option>
                                <option>Fern</option>
                            </select>
                        </div>
                    </div>
                    <div class="control">
                        <div class="select is-small">
                            <select>
                                <option>Snellen</option>
                                <option>Landolt</option>
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
                        <input class="visus-input input is-small" type="text" placeholder="Visus" />
                        <label class="checkbox">
                            <input type="checkbox" />
                            <span class="checkbox-label">Stenop.</span>
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
                        <input class="visus-input input is-small" type="text" placeholder="Visus" />
                        <label class="checkbox">
                            <input type="checkbox" />
                            <span class="checkbox-label">Stenop.</span>
                        </label>
                    </div>
                </div>
            </div>
        </section>
        `
    }




    private getFormData(): TonometrieData {
        return this.formData;
    }

    private _handleSubmit(_: Event) {
        console.log(this.getFormData());

        const event = new CustomEvent('add-observation', {
            detail: this.getFormData() ,
            bubbles: false,  // Allow the event to bubble up
            composed: true  // Allow the event to cross shadow DOM boundaries
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
            .visus-input {
                max-width: 170px;
            }

            .field-label {
                font-weight: bold;
                text-align: center;
            }

            .horizontal-fields {
                display: flex;
                justify-content: space-between;
            }

            .horizontal-fields .box {
                width: 45%;
				margin-bottom: 0px;
            }

            .inputs-inline {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 0.75rem;
            }

            .is-small-input {
                width: 30%;
            }

            .checkbox-label {
                margin-left: 0.5rem;
            }
        `
    ]
}

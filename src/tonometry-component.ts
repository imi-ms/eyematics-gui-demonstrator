import {customElement, state} from "lit/decorators.js";
import {html, LitElement} from "lit";
import {bulmaStyles} from "./bulma-styles.ts";
import {TonometrieData} from "./tonometryData.ts";

@customElement('tonometry-component')
export class TonometryComponent extends LitElement {


    @state()
    private formData: TonometrieData = {
        tonometryType: 'applanatorisch',
        recordedDate: new Date().toISOString().slice(0, 16),
        rightEye: { pressure: 18, isDropped: false },
        leftEye: { pressure: 20, isDropped: false },
    };

    render() {
        return html`
            <section class="section">
                <div class="container">
                    <!-- Header Section -->
                    <div class="field is-grouped is-align-items-center">
                        <label class="label has-text-weight-bold">Tonometrie:</label>
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
                                    <option ?selected=${this.formData.tonometryType === 'applanatorisch'}>applanatorisch</option>
                                    <option ?selected=${this.formData.tonometryType === 'pneumatisch'}>pneumatisch</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="columns mt-3">
                        <div class="column is-half">
                            <div class="field is-horizontal">
                                <div class="field-label">
                                    <label class="label">Rechtes Auge:</label>
                                </div>
                                <div class="field-body">
                                    <div class="field has-addons">
                                        <div class="control">
                                            <input class="input is-small" type="number" .value="${this.formData.rightEye.pressure}">
                                        </div>
                                        <p class="button is-static is-small">mmHg</p>
                                    </div>
                                    <div class="field ml-2">
                                        <label class="checkbox"><input type="checkbox" .value="${this.formData.rightEye.isDropped}"> aufgetropft</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Left Eye -->
                        <div class="column is-half">
                            <div class="field is-horizontal">
                                <div class="field-label">
                                    <label class="label">linkes Auge:</label>
                                </div>
                                <div class="field-body">
                                    <div class="field has-addons">
                                        <div class="control">
                                            <input class="input is-small" type="number" .value="${this.formData.leftEye.pressure}">
                                        </div>
                                        <p class="button is-static is-small">mmHg</p>
                                    </div>
                                    <div class="field ml-2">
                                        <label class="checkbox"><input type="checkbox" .value="${this.formData.leftEye.isDropped}"> aufgetropft</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button class="button is-primary" @click="${this._handleSubmit}">Erfassen</button>
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


    static styles = [bulmaStyles]
}

import { customElement, state } from "lit/decorators.js";
import { html, LitElement } from "lit";
import { bulmaStyles } from "./bulma-styles.ts";
import { IOPMethod, TonometrieData } from "./tonometryData.ts";

@customElement("tonometry-component")
export class TonometryComponent extends LitElement {
	@state()
	private formData: TonometrieData = {
		tonometryType: IOPMethod.Applanation,
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
								class="recordedDate input is-small"
								type="datetime-local"
								placeholder="Messzeitpunkt (Default: Jetzt)"
								.value="${this.formData.recordedDate}"
							/>
						</div>
						<div class="control">
							<div class="select is-small">
								<select class="tonometryType">
									${Object.entries(IOPMethod).map(
										([key, value]) => html`
											<option value="${key}" ?selected=${this.formData.tonometryType === value}>
												${value}
											</option>
										`
									)}
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
									<div class="field has-addons is-narrow">
										<div class="control">
											<input
												class="pressure-right input is-small"
												type="number"
												placeholder="Tonometrie rechts"
											/>
										</div>
										<p class="button is-static is-small">mmHg</p>
									</div>
									<div class="field ml-2">
										<label class="checkbox">
											<input
												class="isDropped-right"
												type="checkbox"
												.value="${this.formData.rightEye.isDropped}"
											/>
											Mydriasis</label
										>
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
									<div class="field has-addons is-narrow">
										<div class="control">
											<input
												class="pressure-left input is-small"
												type="number"
												placeholder="Tonometrie links"
											/>
										</div>
										<p class="button is-static is-small">mmHg</p>
									</div>
									<div class="field ml-2">
										<label class="checkbox"
											><input
												class="isDropped-left"
												type="checkbox"
												.value="${this.formData.leftEye.isDropped}"
											/>
											Mydriasis</label
										>
									</div>
								</div>
							</div>
						</div>
					</div>
					<button class="button is-primary" @click="${this._handleSubmit}">Erfassen</button>
				</div>
			</section>
		`;
	}

	private getFormData(): TonometrieData {
		return {
			tonometryType:
				(this.renderRoot.querySelector<HTMLSelectElement>(".tonometryType")?.value as IOPMethod) ||
				this.formData.tonometryType,
			recordedDate:
				this.renderRoot.querySelector<HTMLInputElement>(".recordedDate")?.value || this.formData.recordedDate,
			rightEye: {
				pressure:
					Number(this.renderRoot.querySelector<HTMLInputElement>(".pressure-right")?.value) ||
					this.formData.rightEye.pressure,
				isDropped:
					this.renderRoot.querySelector<HTMLInputElement>(".isDropped-right")?.checked ||
					this.formData.rightEye.isDropped,
			},
			leftEye: {
				pressure:
					Number(this.renderRoot.querySelector<HTMLInputElement>(".pressure-left")?.value) ||
					this.formData.leftEye.pressure,
				isDropped:
					this.renderRoot.querySelector<HTMLInputElement>(".isDropped-left")?.checked ||
					this.formData.leftEye.isDropped,
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

	static styles = [bulmaStyles];
}

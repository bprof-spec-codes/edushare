import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { tsParticles } from 'tsparticles-engine';
import { loadSnowPreset } from 'tsparticles-preset-snow';

@Component({
  selector: 'app-snow',
  standalone: false,
  templateUrl: './snow.component.html',
  styleUrl: './snow.component.sass'
})
export class SnowComponent implements AfterViewInit, OnDestroy {

  private readonly id = 'tsparticles-snow';

  async ngAfterViewInit(): Promise<void> {

    await loadSnowPreset(tsParticles);

    await tsParticles.load(this.id, {
      preset: "snow",
      background: { color: { value: "transparent" } },

      particles: {
        number: { value: 50 },
        color: { value: "#cacad1ff" },
        stroke: { width: 0.5, color: "#4b89edff" },

        opacity: { value: { min: 0.35, max: 0.65 } },
        size: { value: { min: 2, max: 3 } },

        move: {
          enable: true,
          direction: "bottom",
          speed: { min: 0.2, max: 0.55 },
          outModes: { default: "out" }
        }
      }
    });
  }

  ngOnDestroy(): void {
    
  }

}

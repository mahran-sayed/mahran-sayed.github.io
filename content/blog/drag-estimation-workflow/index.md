Before I open a CFD package, I like to have a number in my head. Not a good number, just an honest order of magnitude. If the simulation later disagrees by a factor of three, I know something is wrong with the setup instead of believing the colourful plots.

## The one equation

Almost every drag estimate starts from

$$D = \tfrac{1}{2}\,\rho\,V^2\,S\,C_D$$

where $\rho$ is the fluid density, $V$ the speed, $S$ a **reference area** and $C_D$ the drag coefficient *based on that area*. The most common source of a wrong answer is not the physics, it is mixing reference areas: wetted area for a streamlined hull, frontal area for a bluff frame, volume to the power 2/3 for some airship data. Always write down which one a coefficient uses.

## Streamlined bodies: friction plus form

For a smooth body of revolution, drag is mostly skin friction. A quick recipe:

1. Reynolds number: $Re = VL/\nu$.
2. Friction coefficient from the ITTC-1957 line: $C_F = \dfrac{0.075}{(\log_{10} Re - 2)^2}$.
3. A form factor for pressure drag. Hoerner gives, for a body of revolution with diameter $d$ and length $L$:
   $k = 1 + 1.5\,(d/L)^{3/2} + 7\,(d/L)^3$.
4. $C_D = k\,C_F$ on the wetted area $S_w$.

A worked example, a 2 m long, 0.3 m diameter torpedo-shaped body at 1.5 m/s in seawater ($\rho = 1025$ kg/m³, $\nu = 1.19\times10^{-6}$ m²/s):

```python
import math

rho, nu = 1025.0, 1.19e-6
V, L, d = 1.5, 2.0, 0.3

Re = V * L / nu                                   # 2.52e6
CF = 0.075 / (math.log10(Re) - 2) ** 2            # 0.00387
k  = 1 + 1.5 * (d / L) ** 1.5 + 7 * (d / L) ** 3 # 1.111
Sw = 0.75 * math.pi * d * L                       # 1.41 m^2 (approximation)
CD = k * CF                                       # 0.00430

D = 0.5 * rho * V**2 * Sw * CD
print(f"Drag = {D:.1f} N")                        # about 7.0 N
```

About 7 N. If CFD says 70 N or 0.7 N for this body, stop and look for the mistake.

## Bluff bodies: build it up from parts

An open-frame vehicle is a different animal. Pressure drag dominates, flow separates everywhere and a smooth-body formula is useless. The standard approach is a **component build-up**: split the vehicle into cylinders, plates, spheres and boxes, take a coefficient for each from the literature (Hoerner's *Fluid-Dynamic Drag* is the classic source), multiply by its projected area and add them up.

Typical orders of magnitude, based on frontal area: a sphere around 0.5 (subcritical), a circular cylinder in cross-flow around 1.2, a flat disc or plate normal to the flow around 1.2 to 2. Add an interference allowance because the parts shade each other, and you have a first estimate that is usually within tens of percent for a simple frame.

## Where it fits in the workflow

| Stage | Tool | What it gives you |
| --- | --- | --- |
| 1. Hand calculation | Spreadsheet or a short script | Order of magnitude, sensitivity to speed and area |
| 2. Lower-fidelity tools | Panel methods, empirical codes | Trends for conceptual design in minutes |
| 3. CFD | Full simulation | Detailed forces, flow structures, interference |
| 4. Compare | Back to stage 1 | Is the answer believable? |

The hand calculation is not there to replace CFD. It tells you what CFD should roughly say, and CFD tells you what the hand calculation missed. When the two agree, you can trust both. When they disagree, you have learned something either way.

## Takeaways

- Write down the reference area next to every coefficient.
- Estimate first, simulate second, compare third.
- Streamlined body: friction times a form factor. Bluff body: sum of parts.
- A hand calculation that takes ten minutes can save a day of debugging a simulation.

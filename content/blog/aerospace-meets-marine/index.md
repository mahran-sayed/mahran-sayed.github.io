I studied aerospace engineering and now spend my days on underwater vehicles. People often ask how big the jump is. The honest answer: smaller than you would think, but the differences that exist are the ones that bite.

## What carries over

The governing equations are the same. For both an aircraft and an ROV, the flow is described by the incompressible Navier-Stokes equations, because even a fast ship or submarine is far below Mach 0.3. Boundary layers, separation, lift from circulation, induced drag, vortex shedding: all of it transfers directly. An airfoil section does not care whether it is flying or swimming. A hydrofoil is a wing, and a propeller is a rotating wing, which is why I keep a copy of Anderson's *Fundamentals of Aerodynamics* next to the marine books.

The same tools carry over as well: dimensional analysis, panel methods, RANS CFD, wind-tunnel thinking, and the habit of non-dimensionalising everything.

## What changes: the regime

The fluid is different, so the numbers that matter are different.

| Property | Air (15 C) | Seawater (15 C) | Consequence |
| --- | --- | --- | --- |
| Density | 1.225 kg/m³ | 1025 kg/m³ | About 840 times higher: forces and added mass are huge |
| Kinematic viscosity | 1.5e-5 m²/s | 1.2e-6 m²/s | About 13 times lower: same size and speed gives a much higher $Re$ |
| Speed of sound | 340 m/s | about 1500 m/s | Compressibility essentially irrelevant |

## What changes: the physics you did not have in the air

**1. The free surface.** Near the surface a body makes waves, and wave-making resistance depends on the Froude number $Fr = V/\sqrt{gL}$, not on $Re$. At the model scale you can match $Re$ or $Fr$, never both. Ship hydrodynamics lives with that compromise.

**2. Added mass.** When you accelerate a body in water you also accelerate the fluid around it. In air this is negligible. In water it is comparable to the mass of the vehicle, so it appears in the equations of motion as a full matrix. This is why a 6-DOF vehicle model has an added-mass matrix next to the rigid-body one.

**3. Cavitation.** Water can boil at low pressure. On a propeller blade tip or a fast hydrofoil the local pressure can drop to the vapour pressure, and the cavitation number $\sigma = (p - p_v)/(\tfrac{1}{2}\rho V^2)$ tells you how close you are. Aircraft have nothing like it.

**4. Buoyancy and stability.** Weight and buoyancy nearly cancel for a submerged vehicle, so the centre of gravity versus the centre of buoyancy decides how it pitches and rolls. For an aircraft, weight is a big force that lift must overcome. Underwater, it is a small difference of two large ones.

**5. Operating environment.** Waves, currents and sea state replace turbulence and gusts. Seakeeping (RAOs, motions in waves) is its own discipline.

## A mental model

I think of it this way: **same equations, different dimensionless numbers.** If you know your Reynolds, Froude, cavitation and reduced-frequency numbers, you know which physics matter in your problem, whether you are in the air or the sea.

## Takeaways

- Wings, propellers and boundary layers transfer almost unchanged from air to water.
- Added mass, the free surface and cavitation are new and need real attention.
- At sea, ask first: which dimensionless number decides this problem?

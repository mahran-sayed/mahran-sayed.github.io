A propeller open-water diagram looks like a tangle of curves, but it is only telling you three things: how much thrust you get, how much torque it costs, and how efficiently you convert one into the other. All three are plotted against one number, the advance coefficient.

## The four non-dimensional numbers

With propeller diameter $D$, rotational speed $n$ in revolutions per second, speed of advance $V_A$ and water density $\rho$:

$$J = \frac{V_A}{nD} \qquad K_T = \frac{T}{\rho n^2 D^4} \qquad K_Q = \frac{Q}{\rho n^2 D^5} \qquad \eta_0 = \frac{J}{2\pi}\,\frac{K_T}{K_Q}$$

- **$J$, advance coefficient.** How far the propeller moves forward per revolution, as a fraction of its diameter. $J = 0$ is a propeller held still (bollard pull). Larger $J$ means a faster boat for the same rpm.
- **$K_T$, thrust coefficient.** Thrust made dimensionless. It falls as $J$ rises.
- **$K_Q$, torque coefficient.** The same for torque. It also falls with $J$, usually a bit more gently.
- **$\eta_0$, open-water efficiency.** Useful power out ($T V_A$) divided by power in ($2\pi n Q$). It is zero at $J = 0$ (lots of thrust, no forward motion), climbs to a peak and then collapses to zero where thrust vanishes.

## Reading the chart

Typical charts plot $K_T$, $10K_Q$ and $\eta_0$ against $J$ for one propeller, or a family of curves for several pitch-to-diameter ratios $P/D$. The factor of 10 on $K_Q$ is only there so it shares an axis with $K_T$.

Three things to look for:

1. **The efficiency peak.** Your design point should sit near it. Off-peak, you pay in fuel or battery.
2. **$K_T = 0$ crossing.** Beyond this $J$ the propeller produces no thrust at all. Higher pitch moves it to the right.
3. **The bollard end ($J = 0$).** Where thrusters and tugs live. A propeller with a great peak efficiency can still be a poor bollard-pull propeller.

## A worked example

A 0.30 m propeller turning at 10 rev/s (600 rpm), advancing at 1.8 m/s, producing 166 N of thrust and 7.5 N m of torque in seawater:

```python
import math

rho, n, D = 1025.0, 10.0, 0.30
VA, T, Q = 1.8, 166.0, 7.5

J   = VA / (n * D)                    # 0.600
KT  = T / (rho * n**2 * D**4)         # 0.200
KQ  = Q / (rho * n**2 * D**5)         # 0.0301
eta = J * KT / (2 * math.pi * KQ)     # 0.634
print(J, KT, KQ, eta)
```

An efficiency of about 63 percent is a healthy number for a small propeller. A cross-check that always works: $\eta_0 = T V_A / (2\pi n Q)$ gives the same answer from the raw numbers.

## Series: where the curves come from

Designers rarely derive these curves from scratch. They use **systematic series**, families of propellers tested in open water at many geometries, so that $K_T$ and $K_Q$ can be looked up or computed from polynomials.

- The **Wageningen B-series** covers fixed-pitch propellers from 2 to 7 blades, with blade-area ratios from about 0.30 to 1.05 and pitch ratios from about 0.5 to 1.4. It is the workhorse of preliminary design.
- The **Kaplan (Ka) series** is meant for ducted propellers. Inside a nozzle it delivers much more thrust at low speed, which is why it appears on tugs and thrusters.

Whichever series you use, remember that model-scale curves assume a certain Reynolds number. Check the correction for yours.

## Takeaways

- $J$, $K_T$, $K_Q$ and $\eta_0$ are all you need to read any propeller chart.
- Pick the design point near the efficiency peak, unless bollard pull is what matters.
- Cross-check from raw numbers: $\eta_0 = T V_A / (2\pi n Q)$.

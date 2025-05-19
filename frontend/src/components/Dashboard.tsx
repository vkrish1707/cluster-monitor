'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

function formatTimeLabel(timestamp: string): string {
    const date = new Date(timestamp)
    return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// Helper to format date as "May 15" etc.
function formatDateOnly(timestamp: string): string {
    const date = new Date(timestamp)
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

const rawData = {
    "iops": [
        { "timestamp": "2025-05-15T00:00:00Z", "read": 12433, "write": 12433 * 0.7 },
        { "timestamp": "2025-05-15T01:00:00Z", "read": 5470, "write": 5470 * 0.7 },
        { "timestamp": "2025-05-15T02:00:00Z", "read": 18385, "write": 18385 * 0.7 },
        { "timestamp": "2025-05-15T03:00:00Z", "read": 5663, "write": 5663 * 0.7 },
        { "timestamp": "2025-05-15T04:00:00Z", "read": 18622, "write": 18622 * 0.7 },
        { "timestamp": "2025-05-15T05:00:00Z", "read": 7790, "write": 7790 * 0.7 },
        { "timestamp": "2025-05-15T06:00:00Z", "read": 13097, "write": 13097 * 0.7 },
        { "timestamp": "2025-05-15T07:00:00Z", "read": 9002, "write": 9002 * 0.7 },
        { "timestamp": "2025-05-15T08:00:00Z", "read": 17820, "write": 17820 * 0.7 },
        { "timestamp": "2025-05-15T09:00:00Z", "read": 12061, "write": 12061 * 0.7 },
        { "timestamp": "2025-05-15T10:00:00Z", "read": 12863, "write": 12863 * 0.7 },
        { "timestamp": "2025-05-15T11:00:00Z", "read": 12847, "write": 12847 * 0.7 },
        { "timestamp": "2025-05-15T12:00:00Z", "read": 6258, "write": 6258 * 0.7 },
        { "timestamp": "2025-05-15T13:00:00Z", "read": 13587, "write": 13587 * 0.7 },
        { "timestamp": "2025-05-15T14:00:00Z", "read": 10844, "write": 10844 * 0.7 },
        { "timestamp": "2025-05-15T15:00:00Z", "read": 103866, "write": 103866 * 0.7 },
        { "timestamp": "2025-05-15T16:00:00Z", "read": 13973, "write": 13973 * 0.7 },
        { "timestamp": "2025-05-15T17:00:00Z", "read": 9125, "write": 9125 * 0.7 },
        { "timestamp": "2025-05-15T18:00:00Z", "read": 16627, "write": 16627 * 0.7 },
        { "timestamp": "2025-05-15T19:00:00Z", "read": 15002, "write": 15002 * 0.7 },
        { "timestamp": "2025-05-16T00:00:00Z", "read": 15264, "write": 15264 * 0.7 },
        { "timestamp": "2025-05-16T01:00:00Z", "read": 13264, "write": 13264 * 0.7 },
        { "timestamp": "2025-05-16T02:00:00Z", "read": 17582, "write": 17582 * 0.7 },
        { "timestamp": "2025-05-16T03:00:00Z", "read": 14529, "write": 14529 * 0.7 },
        { "timestamp": "2025-05-16T04:00:00Z", "read": 6793, "write": 6793 * 0.7 },
        { "timestamp": "2025-05-16T05:00:00Z", "read": 15613, "write": 15613 * 0.7 },
        { "timestamp": "2025-05-16T06:00:00Z", "read": 13952, "write": 13952 * 0.7 },
        { "timestamp": "2025-05-16T07:00:00Z", "read": 17789, "write": 17789 * 0.7 },
        { "timestamp": "2025-05-16T08:00:00Z", "read": 11762, "write": 11762 * 0.7 },
        { "timestamp": "2025-05-16T09:00:00Z", "read": 11536, "write": 11536 * 0.7 },
        { "timestamp": "2025-05-16T10:00:00Z", "read": 5754, "write": 5754 * 0.7 },
        { "timestamp": "2025-05-16T11:00:00Z", "read": 8471, "write": 8471 * 0.7 },
        { "timestamp": "2025-05-16T12:00:00Z", "read": 11840, "write": 11840 * 0.7 },
        { "timestamp": "2025-05-16T13:00:00Z", "read": 92443, "write": 92443 * 0.7 },
        { "timestamp": "2025-05-16T14:00:00Z", "read": 7478, "write": 7478 * 0.7 },
        { "timestamp": "2025-05-16T15:00:00Z", "read": 7145, "write": 7145 * 0.7 },
        { "timestamp": "2025-05-16T16:00:00Z", "read": 6723, "write": 6723 * 0.7 },
        { "timestamp": "2025-05-16T17:00:00Z", "read": 15586, "write": 15586 * 0.7 },
        { "timestamp": "2025-05-16T18:00:00Z", "read": 9418, "write": 9418 * 0.7 },
        { "timestamp": "2025-05-16T19:00:00Z", "read": 12911, "write": 12911 * 0.7 },
        { "timestamp": "2025-05-17T00:00:00Z", "read": 9894, "write": 9894 * 0.7 },
        { "timestamp": "2025-05-17T01:00:00Z", "read": 6940, "write": 6940 * 0.7 },
        { "timestamp": "2025-05-17T02:00:00Z", "read": 14382, "write": 14382 * 0.7 },
        { "timestamp": "2025-05-17T03:00:00Z", "read": 5541, "write": 5541 * 0.7 },
        { "timestamp": "2025-05-17T04:00:00Z", "read": 9696, "write": 9696 * 0.7 },
        { "timestamp": "2025-05-17T05:00:00Z", "read": 17648, "write": 17648 * 0.7 },
        { "timestamp": "2025-05-17T06:00:00Z", "read": 5528, "write": 5528 * 0.7 },
        { "timestamp": "2025-05-17T07:00:00Z", "read": 8383, "write": 8383 * 0.7 },
        { "timestamp": "2025-05-17T08:00:00Z", "read": 13756, "write": 13756 * 0.7 },
        { "timestamp": "2025-05-17T09:00:00Z", "read": 16889, "write": 16889 * 0.7 },
        { "timestamp": "2025-05-17T10:00:00Z", "read": 8027, "write": 8027 * 0.7 },
        { "timestamp": "2025-05-17T11:00:00Z", "read": 5290, "write": 5290 * 0.7 },
        { "timestamp": "2025-05-17T12:00:00Z", "read": 6849, "write": 6849 * 0.7 },
        { "timestamp": "2025-05-17T13:00:00Z", "read": 17663, "write": 17663 * 0.7 },
        { "timestamp": "2025-05-17T14:00:00Z", "read": 100895, "write": 100895 * 0.7 },
        { "timestamp": "2025-05-17T15:00:00Z", "read": 14398, "write": 14398 * 0.7 },
        { "timestamp": "2025-05-17T16:00:00Z", "read": 16252, "write": 16252 * 0.7 },
        { "timestamp": "2025-05-17T17:00:00Z", "read": 19188, "write": 19188 * 0.7 },
        { "timestamp": "2025-05-17T18:00:00Z", "read": 11265, "write": 11265 * 0.7 },
        { "timestamp": "2025-05-17T19:00:00Z", "read": 7920, "write": 7920 * 0.7 },
        { "timestamp": "2025-05-18T00:00:00Z", "read": 15022, "write": 15022 * 0.7 },
        { "timestamp": "2025-05-18T01:00:00Z", "read": 5830, "write": 5830 * 0.7 },
        { "timestamp": "2025-05-18T02:00:00Z", "read": 18117, "write": 18117 * 0.7 },
        { "timestamp": "2025-05-18T03:00:00Z", "read": 19939, "write": 19939 * 0.7 },
        { "timestamp": "2025-05-18T04:00:00Z", "read": 14790, "write": 14790 * 0.7 },
        { "timestamp": "2025-05-18T05:00:00Z", "read": 14555, "write": 14555 * 0.7 },
        { "timestamp": "2025-05-18T06:00:00Z", "read": 7378, "write": 7378 * 0.7 },
        { "timestamp": "2025-05-18T07:00:00Z", "read": 15551, "write": 15551 * 0.7 },
        { "timestamp": "2025-05-18T08:00:00Z", "read": 8544, "write": 8544 * 0.7 },
        { "timestamp": "2025-05-18T09:00:00Z", "read": 12898, "write": 12898 * 0.7 },
        { "timestamp": "2025-05-18T10:00:00Z", "read": 16224, "write": 16224 * 0.7 },
        { "timestamp": "2025-05-18T11:00:00Z", "read": 16763, "write": 16763 * 0.7 },
        { "timestamp": "2025-05-18T12:00:00Z", "read": 17550, "write": 17550 * 0.7 },
        { "timestamp": "2025-05-18T13:00:00Z", "read": 6722, "write": 6722 * 0.7 },
        { "timestamp": "2025-05-18T14:00:00Z", "read": 105601, "write": 105601 * 0.3 },
        { "timestamp": "2025-05-18T15:00:00Z", "read": 14556, "write": 14556 * 0.7 },
        { "timestamp": "2025-05-18T16:00:00Z", "read": 12968, "write": 12968 * 0.7 },
        { "timestamp": "2025-05-18T17:00:00Z", "read": 8162, "write": 8162 * 0.7 },
        { "timestamp": "2025-05-18T18:00:00Z", "read": 18128, "write": 18128 * 0.7 },
        { "timestamp": "2025-05-18T19:00:00Z", "read": 19875, "write": 19875 * 0.7 },
        { "timestamp": "2025-05-19T00:00:00Z", "read": 17641, "write": 17641 * 0.4 },
        { "timestamp": "2025-05-19T01:00:00Z", "read": 9485, "write": 9485 * 0.7 },
        { "timestamp": "2025-05-19T02:00:00Z", "read": 18429, "write": 18429 * 0.7 },
        { "timestamp": "2025-05-19T03:00:00Z", "read": 16711, "write": 16711 * 0.7 },
        { "timestamp": "2025-05-19T04:00:00Z", "read": 13743, "write": 13743 * 0.7 },
        { "timestamp": "2025-05-19T05:00:00Z", "read": 7060, "write": 7060 * 0.7 },
        { "timestamp": "2025-05-19T06:00:00Z", "read": 18290, "write": 18290 * 0.7 },
        { "timestamp": "2025-05-19T07:00:00Z", "read": 96782, "write": 96782 * 0.7 },
        { "timestamp": "2025-05-19T08:00:00Z", "read": 7909, "write": 7909 * 0.7 },
        { "timestamp": "2025-05-19T09:00:00Z", "read": 10951, "write": 10951 * 0.7 },
        { "timestamp": "2025-05-19T10:00:00Z", "read": 5792, "write": 5792 * 0.7 },
        { "timestamp": "2025-05-19T11:00:00Z", "read": 17711, "write": 17711 * 0.7 },
        { "timestamp": "2025-05-19T12:00:00Z", "read": 5925, "write": 5925 * 0.7 },
        { "timestamp": "2025-05-19T13:00:00Z", "read": 5206, "write": 5206 * 0.7 },
        { "timestamp": "2025-05-19T14:00:00Z", "read": 10535, "write": 10535 * 0.7 },
        { "timestamp": "2025-05-19T15:00:00Z", "read": 19457, "write": 19457 * 0.7 },
        { "timestamp": "2025-05-19T16:00:00Z", "read": 9274, "write": 9274 * 0.7 },
        { "timestamp": "2025-05-19T17:00:00Z", "read": 10310, "write": 10310 * 0.7 },
        { "timestamp": "2025-05-19T18:00:00Z", "read": 15486, "write": 15486 * 0.7 },
        { "timestamp": "2025-05-19T19:00:00Z", "read": 15599, "write": 15599 * 0.7 }
    ],
    "throughput": [
        { "timestamp": "2025-05-15T00:00:00Z", "read": 533, "write": 533 * 0.8 },
        { "timestamp": "2025-05-15T01:00:00Z", "read": 789, "write": 789 * 0.8 },
        { "timestamp": "2025-05-15T02:00:00Z", "read": 765, "write": 765 * 0.8 },
        { "timestamp": "2025-05-15T03:00:00Z", "read": 703, "write": 703 * 0.8 },
        { "timestamp": "2025-05-15T04:00:00Z", "read": 562, "write": 562 * 0.8 },
        { "timestamp": "2025-05-15T05:00:00Z", "read": 577, "write": 577 * 0.8 },
        { "timestamp": "2025-05-15T06:00:00Z", "read": 584, "write": 584 * 0.8 },
        { "timestamp": "2025-05-15T07:00:00Z", "read": 678, "write": 678 * 0.8 },
        { "timestamp": "2025-05-15T08:00:00Z", "read": 709, "write": 709 * 0.8 },
        { "timestamp": "2025-05-15T09:00:00Z", "read": 772, "write": 772 * 0.8 },
        { "timestamp": "2025-05-15T10:00:00Z", "read": 788, "write": 788 * 0.8 },
        { "timestamp": "2025-05-15T11:00:00Z", "read": 458, "write": 458 * 0.8 },
        { "timestamp": "2025-05-15T12:00:00Z", "read": 573, "write": 573 * 0.8 },
        { "timestamp": "2025-05-15T13:00:00Z", "read": 789, "write": 789 * 0.8 },
        { "timestamp": "2025-05-15T14:00:00Z", "read": 452, "write": 452 * 0.8 },
        { "timestamp": "2025-05-15T15:00:00Z", "read": 1750, "write": 1750 * 0.8 },
        { "timestamp": "2025-05-15T16:00:00Z", "read": 534, "write": 534 * 0.8 },
        { "timestamp": "2025-05-15T17:00:00Z", "read": 329, "write": 329 * 0.8 },
        { "timestamp": "2025-05-15T18:00:00Z", "read": 560, "write": 560 * 0.8 },
        { "timestamp": "2025-05-15T19:00:00Z", "read": 576, "write": 576 * 0.8 },
        { "timestamp": "2025-05-16T00:00:00Z", "read": 279, "write": 279 * 0.8 },
        { "timestamp": "2025-05-16T01:00:00Z", "read": 511, "write": 511 * 0.8 },
        { "timestamp": "2025-05-16T02:00:00Z", "read": 739, "write": 739 * 0.8 },
        { "timestamp": "2025-05-16T03:00:00Z", "read": 718, "write": 718 * 0.8 },
        { "timestamp": "2025-05-16T04:00:00Z", "read": 228, "write": 228 * 0.8 },
        { "timestamp": "2025-05-16T05:00:00Z", "read": 242, "write": 242 * 0.8 },
        { "timestamp": "2025-05-16T06:00:00Z", "read": 362, "write": 362 * 0.8 },
        { "timestamp": "2025-05-16T07:00:00Z", "read": 613, "write": 613 * 0.8 },
        { "timestamp": "2025-05-16T08:00:00Z", "read": 608, "write": 608 * 0.8 },
        { "timestamp": "2025-05-16T09:00:00Z", "read": 236, "write": 236 * 0.8 },
        { "timestamp": "2025-05-16T10:00:00Z", "read": 789, "write": 789 * 0.8 },
        { "timestamp": "2025-05-16T11:00:00Z", "read": 336, "write": 336 * 0.8 },
        { "timestamp": "2025-05-16T12:00:00Z", "read": 713, "write": 713 * 0.8 },
        { "timestamp": "2025-05-16T13:00:00Z", "read": 2374, "write": 2374 * 0.8 },
        { "timestamp": "2025-05-16T14:00:00Z", "read": 730, "write": 730 * 0.8 },
        { "timestamp": "2025-05-16T15:00:00Z", "read": 405, "write": 405 * 0.8 },
        { "timestamp": "2025-05-16T16:00:00Z", "read": 661, "write": 661 * 0.8 },
        { "timestamp": "2025-05-16T17:00:00Z", "read": 686, "write": 686 * 0.8 },
        { "timestamp": "2025-05-16T18:00:00Z", "read": 582, "write": 582 * 0.8 },
        { "timestamp": "2025-05-16T19:00:00Z", "read": 230, "write": 230 * 0.8 },
        { "timestamp": "2025-05-17T00:00:00Z", "read": 549, "write": 549 * 0.8 },
        { "timestamp": "2025-05-17T01:00:00Z", "read": 288, "write": 288 * 0.8 },
        { "timestamp": "2025-05-17T02:00:00Z", "read": 561, "write": 561 * 0.8 },
        { "timestamp": "2025-05-17T03:00:00Z", "read": 288, "write": 288 * 0.8 },
        { "timestamp": "2025-05-17T04:00:00Z", "read": 721, "write": 721 * 0.8 },
        { "timestamp": "2025-05-17T05:00:00Z", "read": 290, "write": 290 * 0.8 },
        { "timestamp": "2025-05-17T06:00:00Z", "read": 753, "write": 753 * 0.8 },
        { "timestamp": "2025-05-17T07:00:00Z", "read": 351, "write": 351 * 0.8 },
        { "timestamp": "2025-05-17T08:00:00Z", "read": 777, "write": 777 * 0.8 },
        { "timestamp": "2025-05-17T09:00:00Z", "read": 324, "write": 324 * 0.8 },
        { "timestamp": "2025-05-17T10:00:00Z", "read": 570, "write": 570 * 0.8 },
        { "timestamp": "2025-05-17T11:00:00Z", "read": 784, "write": 784 * 0.8 },
        { "timestamp": "2025-05-17T12:00:00Z", "read": 441, "write": 441 * 0.8 },
        { "timestamp": "2025-05-17T13:00:00Z", "read": 442, "write": 442 * 0.8 },
        { "timestamp": "2025-05-17T14:00:00Z", "read": 2077, "write": 2077 * 0.8 },
        { "timestamp": "2025-05-17T15:00:00Z", "read": 423, "write": 423 * 0.8 },
        { "timestamp": "2025-05-17T16:00:00Z", "read": 317, "write": 317 * 0.8 },
        { "timestamp": "2025-05-17T17:00:00Z", "read": 545, "write": 545 * 0.8 },
        { "timestamp": "2025-05-17T18:00:00Z", "read": 759, "write": 759 * 0.8 },
        { "timestamp": "2025-05-17T19:00:00Z", "read": 751, "write": 751 * 0.8 },
        { "timestamp": "2025-05-18T00:00:00Z", "read": 388, "write": 388 * 0.8 },
        { "timestamp": "2025-05-18T01:00:00Z", "read": 338, "write": 338 * 0.8 },
        { "timestamp": "2025-05-18T02:00:00Z", "read": 760, "write": 760 * 0.8 },
        { "timestamp": "2025-05-18T03:00:00Z", "read": 748, "write": 748 * 0.8 },
        { "timestamp": "2025-05-18T04:00:00Z", "read": 475, "write": 475 * 0.8 },
        { "timestamp": "2025-05-18T05:00:00Z", "read": 507, "write": 507 * 0.8 },
        { "timestamp": "2025-05-18T06:00:00Z", "read": 278, "write": 278 * 0.8 },
        { "timestamp": "2025-05-18T07:00:00Z", "read": 307, "write": 307 * 0.8 },
        { "timestamp": "2025-05-18T08:00:00Z", "read": 370, "write": 370 * 0.8 },
        { "timestamp": "2025-05-18T09:00:00Z", "read": 670, "write": 670 * 0.8 },
        { "timestamp": "2025-05-18T10:00:00Z", "read": 389, "write": 389 * 0.8 },
        { "timestamp": "2025-05-18T11:00:00Z", "read": 570, "write": 570 * 0.8 },
        { "timestamp": "2025-05-18T12:00:00Z", "read": 243, "write": 243 * 0.8 },
        { "timestamp": "2025-05-18T13:00:00Z", "read": 636, "write": 636 * 0.8 },
        { "timestamp": "2025-05-18T14:00:00Z", "read": 1816, "write": 1816 * 0.8 },
        { "timestamp": "2025-05-18T15:00:00Z", "read": 410, "write": 410 * 0.8 },
        { "timestamp": "2025-05-18T16:00:00Z", "read": 221, "write": 221 * 0.8 },
        { "timestamp": "2025-05-18T17:00:00Z", "read": 298, "write": 298 * 0.8 },
        { "timestamp": "2025-05-18T18:00:00Z", "read": 536, "write": 536 * 0.8 },
        { "timestamp": "2025-05-18T19:00:00Z", "read": 276, "write": 276 * 0.8 },
        { "timestamp": "2025-05-19T00:00:00Z", "read": 545, "write": 545 * 0.8 },
        { "timestamp": "2025-05-19T01:00:00Z", "read": 545, "write": 545 * 0.8 },
        { "timestamp": "2025-05-19T02:00:00Z", "read": 209, "write": 209 * 0.8 },
        { "timestamp": "2025-05-19T03:00:00Z", "read": 423, "write": 423 * 0.8 },
        { "timestamp": "2025-05-19T04:00:00Z", "read": 278, "write": 278 * 0.8 },
        { "timestamp": "2025-05-19T05:00:00Z", "read": 259, "write": 259 * 0.8 },
        { "timestamp": "2025-05-19T06:00:00Z", "read": 768, "write": 768 * 0.8 },
        { "timestamp": "2025-05-19T07:00:00Z", "read": 1746, "write": 1746 * 0.8 },
        { "timestamp": "2025-05-19T08:00:00Z", "read": 462, "write": 462 * 0.8 },
        { "timestamp": "2025-05-19T09:00:00Z", "read": 734, "write": 734 * 0.8 },
        { "timestamp": "2025-05-19T10:00:00Z", "read": 457, "write": 457 * 0.8 },
        { "timestamp": "2025-05-19T11:00:00Z", "read": 371, "write": 371 * 0.8 },
        { "timestamp": "2025-05-19T12:00:00Z", "read": 291, "write": 291 * 0.8 },
        { "timestamp": "2025-05-19T13:00:00Z", "read": 650, "write": 650 * 0.8 },
        { "timestamp": "2025-05-19T14:00:00Z", "read": 461, "write": 461 * 0.8 },
        { "timestamp": "2025-05-19T15:00:00Z", "read": 773, "write": 773 * 0.8 },
        { "timestamp": "2025-05-19T16:00:00Z", "read": 452, "write": 452 * 0.8 },
        { "timestamp": "2025-05-19T17:00:00Z", "read": 606, "write": 606 * 0.8 },
        { "timestamp": "2025-05-19T18:00:00Z", "read": 411, "write": 411 * 0.8 },
        { "timestamp": "2025-05-19T19:00:00Z", "read": 726, "write": 726 * 0.8 }
    ]
}
const IOPS_ANOMALY_THRESHOLD = 100000;
const THROUGHPUT_ANOMALY_THRESHOLD = 1800;
const sampleData = rawData.iops.map((item, index) => ({
    time: item.timestamp,
    label: formatDateOnly(item.timestamp),
    readIOPS: item.read,
    writeIOPS: item.write,
    readThroughput: rawData.throughput[index]?.read || 0,
    writeThroughput: rawData.throughput[index]?.write || 0,
}))

const createAnomalyDot = (key: string, threshold: number) => {
    return ({ cx, cy, payload }: any): React.ReactElement<SVGCircleElement | SVGGElement> => {
        if (payload[key] > threshold) {
            return <circle cx={cx} cy={cy} r={5} fill="red" />;
        }
        return <g key={`anomaly-dot-${cx}-${cy}`} style={{ display: 'none' }} />;
    };
};

export default function Dashboard() {
    return (
        <div className="space-y-10 px-[10px] pt-[5px] pb-10 bg-[#1b222b] text-white min-h-screen">
            <div className="flex justify-between items-center">
                <h2 className="text-[21px] pl-[17px] pt-[12px] text-white">Performance Metrics</h2>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                    <div>Last 7 days ▾</div>
                </div>
            </div>

            {/* IOPS Graph */}
            <div>
                <h3 className="text-[18px] font-medium pl-[40px] mb-2">IOPS</h3>
                <div className="flex flex-col md:flex-row gap-4 items-end md:items-stretch w-full md:h-[200px] [&>*]:w-full md:[&>*]:w-auto">                    <div className="flex-1 bg-[#1b222b] p-5 pl-8 rounded-md relative h-full">
                        <div className="absolute top-0 right-4 text-xs text-white mb-2">Dec. 5, 10:14am</div>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={sampleData}>
                                <XAxis
                                    dataKey="time"
                                    stroke="#999"
                                    ticks={[...new Set(sampleData.map(d => d.label))].map(dateStr => {
                                        const match = sampleData.find(d => d.label === dateStr)
                                        return match?.time || ''
                                    })}
                                    tickFormatter={(value, index) => {
                                        if (index === 0) return ''; // Skip first tick
                                        const date = new Date(value);
                                        return `${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
                                    }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#999' }}
                                    ticks={[0, 50000, 100000]}
                                    tickFormatter={(value) => `${value / 1000}k`}
                                />
                                <CartesianGrid stroke="#2f3b45" horizontal={true} vertical={false} />
                                <Tooltip />
                                <Line type="linear" dataKey="readIOPS" stroke="#a855f7" strokeWidth={2}
                                    dot={createAnomalyDot('readIOPS', IOPS_ANOMALY_THRESHOLD)} />
                                <Line type="linear" dataKey="writeIOPS" stroke="#22d3ee" strokeWidth={2} dot={createAnomalyDot('writeIOPS', IOPS_ANOMALY_THRESHOLD)} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col min-w-[180px] text-white text-sm md:mb-4 md:ml-0 ml-[40px] mt-4 md:mt-0">
                        <div className="text-gray-400 text-[18px] mb-0">IOPS</div>
                        <div className="bg-[#222A33] p-4 border border-[#2C3A48] flex flex-col justify-center h-[165px]">
                            <div className="border-b border-[#2C3A48] pb-2 mb-2">
                                <div className="text-gray-400 text-xs">Read</div>
                                <div className="text-[#a855f7] text-lg font-semibold">21.2k <span className="text-sm font-normal">IOPS</span></div>
                            </div>
                            <div>
                                <div className="text-gray-400 text-xs">Write</div>
                                <div className="text-[#22d3ee] text-lg font-semibold">122.0 <span className="text-sm font-normal">IOPS</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Throughput Graph */}
            <div>
                <h3 className="text-[18px] font-medium mb-2 pl-[40px]">Throughput</h3>
                <div className="flex flex-col md:flex-row gap-4 items-end md:items-stretch w-full md:h-[200px] [&>*]:w-full md:[&>*]:w-auto">
                    <div className="flex-1 bg-[#1b222b] p-5 pl-8  rounded-md relative h-full">
                        <div className="absolute top-0 right-4 text-xs text-white mb-2">Dec. 5, 10:14am</div>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={sampleData}>
                                <XAxis
                                    dataKey="time"
                                    stroke="#999"
                                    ticks={[...new Set(sampleData.map(d => d.label))].map(dateStr => {
                                        const match = sampleData.find(d => d.label === dateStr)
                                        return match?.time || ''
                                    })}
                                    tickFormatter={(value, index) => {
                                        if (index === 0) return ''; // Skip first tick
                                        const date = new Date(value);
                                        return `${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
                                    }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    stroke="#999"
                                    tick={{ fill: '#999' }}
                                    ticks={[0, 1000, 2000]}
                                    tickFormatter={(value) => `${value / 1000}Gbps`}
                                />
                                <CartesianGrid stroke="#2f3b45" horizontal={true} vertical={false} />
                                <Tooltip />
                                <Line type="linear" dataKey="readThroughput" stroke="#a855f7" strokeWidth={2} dot={createAnomalyDot('readThroughput', THROUGHPUT_ANOMALY_THRESHOLD)} />
                                <Line type="linear" dataKey="writeThroughput" stroke="#22d3ee" strokeWidth={2} dot={createAnomalyDot('writeThroughput', THROUGHPUT_ANOMALY_THRESHOLD)} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col min-w-[180px] text-white text-sm md:mb-4 md:ml-0 ml-[40px] mt-4 md:mt-0">
                        <div className="text-gray-400 text-[18px] mb-0">Throughput</div>
                        <div className="bg-[#222A33] p-4 border border-[#2C3A48] flex flex-col justify-center h-[165px]">
                            <div className="border-b border-[#2C3A48] pb-2 mb-2">
                                <div className="text-gray-400 text-xs">Read</div>
                                <div className="text-[#a855f7] text-lg font-semibold">21.2k <span className="text-sm font-normal">IOPS</span></div>
                            </div>
                            <div>
                                <div className="text-gray-400 text-xs">Write</div>
                                <div className="text-[#22d3ee] text-lg font-semibold">122.0 <span className="text-sm font-normal">IOPS</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
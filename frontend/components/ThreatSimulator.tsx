'use client'

import React, { useState } from 'react'
import { Play, Pause, Square, Target, Zap, Clock } from 'lucide-react'

export function ThreatSimulator() {
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null)
  const [simulationResults, setSimulationResults] = useState<any[]>([])

  const threatScenarios = [
    {
      id: 'phishing',
      name: 'Phishing Attack Simulation',
      description: 'Simulate targeted phishing campaigns against your organization',
      duration: '15-30 mins',
      difficulty: 'Medium',
      targets: ['Email Systems', 'Employee Training', 'Security Awareness']
    },
    {
      id: 'ransomware',
      name: 'Ransomware Attack',
      description: 'Test your defenses against ransomware infiltration and spread',
      duration: '45-60 mins',
      difficulty: 'High',
      targets: ['File Systems', 'Backup Systems', 'Network Segmentation']
    },
    {
      id: 'ddos',
      name: 'DDoS Attack Simulation',
      description: 'Test your infrastructure resilience against distributed denial of service',
      duration: '20-40 mins',
      difficulty: 'Medium',
      targets: ['Web Services', 'Load Balancers', 'CDN Systems']
    },
    {
      id: 'insider',
      name: 'Insider Threat Scenario',
      description: 'Simulate malicious insider activities and data exfiltration',
      duration: '30-45 mins',
      difficulty: 'Low',
      targets: ['Access Controls', 'Data Loss Prevention', 'User Monitoring']
    }
  ]

  const runningSimulations = [
    {
      id: 'sim-001',
      type: 'Phishing',
      progress: 65,
      startTime: '14:30',
      estimatedCompletion: '15:15',
      status: 'Running'
    },
    {
      id: 'sim-002',
      type: 'Network Intrusion',
      progress: 90,
      startTime: '13:45',
      estimatedCompletion: '15:00',
      status: 'Finalizing'
    }
  ]

  const startSimulation = (scenarioId: string) => {
    setActiveSimulation(scenarioId)
    // In a real app, this would trigger the actual simulation
    console.log(`Starting simulation: ${scenarioId}`)
  }

  const stopSimulation = (simulationId: string) => {
    // Stop the simulation
    console.log(`Stopping simulation: ${simulationId}`)
  }

  return (
    <div className="space-y-6">
      {/* Active Simulations */}
      {runningSimulations.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Simulations</h3>
          <div className="space-y-4">
            {runningSimulations.map((sim) => (
              <div key={sim.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{sim.type} - {sim.id}</p>
                      <p className="text-sm text-gray-600">Started at {sim.startTime} • ETA: {sim.estimatedCompletion}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{sim.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${sim.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex space-x-2">
                  <button className="btn-secondary">
                    <Pause className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => stopSimulation(sim.id)}
                    className="btn-danger"
                  >
                    <Square className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Threat Scenarios */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Threat Scenarios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {threatScenarios.map((scenario) => (
            <div key={scenario.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                    <Target className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {scenario.duration}
                      </span>
                      <span className={`badge ${
                        scenario.difficulty === 'High' ? 'badge-danger' :
                        scenario.difficulty === 'Medium' ? 'badge-warning' :
                        'badge-success'
                      }`}>
                        {scenario.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{scenario.description}</p>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Target Areas:</p>
                <div className="flex flex-wrap gap-2">
                  {scenario.targets.map((target) => (
                    <span key={target} className="badge badge-primary text-xs">
                      {target}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => startSimulation(scenario.id)}
                disabled={activeSimulation === scenario.id}
                className={`w-full flex items-center justify-center space-x-2 ${
                  activeSimulation === scenario.id 
                    ? 'btn-secondary cursor-not-allowed' 
                    : 'btn-primary'
                }`}
              >
                <Play className="w-4 h-4" />
                <span>
                  {activeSimulation === scenario.id ? 'Starting...' : 'Start Simulation'}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Simulation Configuration */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Simulation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attack Vector
            </label>
            <select className="input">
              <option>Email Phishing</option>
              <option>Network Intrusion</option>
              <option>Social Engineering</option>
              <option>Malware Injection</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target System
            </label>
            <select className="input">
              <option>Web Application</option>
              <option>Database Server</option>
              <option>File Server</option>
              <option>Email System</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Simulation Intensity
            </label>
            <select className="input">
              <option>Low (Safe for Production)</option>
              <option>Medium (Staging Environment)</option>
              <option>High (Test Environment Only)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              min="5"
              max="120"
              defaultValue="30"
              className="input"
            />
          </div>
        </div>
        <div className="mt-6">
          <button className="btn-primary">
            <Zap className="w-4 h-4 mr-2" />
            Launch Custom Simulation
          </button>
        </div>
      </div>
    </div>
  )
}
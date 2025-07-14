'use client'

import { useState, useEffect } from 'react'
import { RiskDashboard } from '@/components/RiskDashboard'
import { ThreatSimulator } from '@/components/ThreatSimulator'
import { SecurityMetrics } from '@/components/SecurityMetrics'
import { AlertsPanel } from '@/components/AlertsPanel'
import { Shield, Activity, Target, AlertTriangle } from 'lucide-react'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [realTimeData, setRealTimeData] = useState({
    riskScore: 0,
    activeThreats: 0,
    simulationsRunning: 0,
    systemStatus: 'healthy'
  })

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        riskScore: Math.floor(Math.random() * 100),
        activeThreats: Math.floor(Math.random() * 20),
        simulationsRunning: Math.floor(Math.random() * 5),
        systemStatus: Math.random() > 0.8 ? 'warning' : 'healthy'
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const tabs = [
    { id: 'dashboard', label: 'Risk Dashboard', icon: Shield },
    { id: 'simulator', label: 'Threat Simulator', icon: Target },
    { id: 'metrics', label: 'Security Metrics', icon: Activity },
    { id: 'alerts', label: 'Alerts & Incidents', icon: AlertTriangle },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Cybersecurity Risk Simulation Platform
            </h1>
            <p className="text-gray-600 mt-2">
              AI-powered threat simulation and risk assessment dashboard
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">
                {realTimeData.riskScore}%
              </div>
              <div className="text-sm text-gray-600">Current Risk Score</div>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              realTimeData.systemStatus === 'healthy' ? 'bg-success-500' : 'bg-warning-500'
            } animate-pulse`} />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Risk Score</p>
              <p className="text-2xl font-bold text-primary-600">
                {realTimeData.riskScore}%
              </p>
            </div>
            <Shield className="w-8 h-8 text-primary-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Threats</p>
              <p className="text-2xl font-bold text-danger-600">
                {realTimeData.activeThreats}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-danger-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Simulations</p>
              <p className="text-2xl font-bold text-warning-600">
                {realTimeData.simulationsRunning}
              </p>
            </div>
            <Target className="w-8 h-8 text-warning-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Status</p>
              <p className={`text-sm font-medium capitalize ${
                realTimeData.systemStatus === 'healthy' ? 'text-success-600' : 'text-warning-600'
              }`}>
                {realTimeData.systemStatus}
              </p>
            </div>
            <Activity className="w-8 h-8 text-success-600" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'dashboard' && <RiskDashboard />}
          {activeTab === 'simulator' && <ThreatSimulator />}
          {activeTab === 'metrics' && <SecurityMetrics />}
          {activeTab === 'alerts' && <AlertsPanel />}
        </div>
      </div>
    </div>
  )
}
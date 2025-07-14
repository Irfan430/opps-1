import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import redis
import psycopg2
from psycopg2.extras import RealDictCursor
import json
from dotenv import load_dotenv

from models.risk_predictor import RiskPredictor
from models.threat_detector import ThreatDetector
from models.anomaly_detector import AnomalyDetector
from services.threat_intelligence import ThreatIntelligenceService
from services.vulnerability_scanner import VulnerabilityScanner
from utils.data_processor import DataProcessor
from utils.model_manager import ModelManager

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['DATABASE_URL'] = os.getenv('DATABASE_URL')
app.config['REDIS_URL'] = os.getenv('REDIS_URL', 'redis://localhost:6379')

# Initialize services
redis_client = redis.from_url(app.config['REDIS_URL'])
data_processor = DataProcessor()
model_manager = ModelManager()

# Initialize AI models
risk_predictor = RiskPredictor()
threat_detector = ThreatDetector()
anomaly_detector = AnomalyDetector()
threat_intelligence = ThreatIntelligenceService()
vulnerability_scanner = VulnerabilityScanner()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0',
        'services': {
            'redis': _check_redis_connection(),
            'database': _check_database_connection(),
            'models': _check_models_status()
        }
    })

@app.route('/api/risk/assess', methods=['POST'])
def assess_risk():
    """Assess cybersecurity risk for given parameters"""
    try:
        data = request.get_json()
        
        # Validate input
        required_fields = ['asset_type', 'network_exposure', 'user_behavior', 'security_controls']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        # Process input data
        processed_data = data_processor.preprocess_risk_data(data)
        
        # Generate risk assessment
        risk_score = risk_predictor.predict_risk(processed_data)
        risk_factors = risk_predictor.get_risk_factors(processed_data)
        
        # Get recommendations
        recommendations = _generate_risk_recommendations(risk_score, risk_factors)
        
        result = {
            'risk_score': float(risk_score),
            'risk_level': _categorize_risk_level(risk_score),
            'risk_factors': risk_factors,
            'recommendations': recommendations,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        # Cache result
        cache_key = f"risk_assessment:{hash(str(data))}"
        redis_client.setex(cache_key, 3600, json.dumps(result))  # Cache for 1 hour
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in risk assessment: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/threats/detect', methods=['POST'])
def detect_threats():
    """Detect potential threats in network traffic or logs"""
    try:
        data = request.get_json()
        
        if 'log_data' not in data and 'network_data' not in data:
            return jsonify({'error': 'Log data or network data required'}), 400
        
        threats = []
        
        # Analyze log data
        if 'log_data' in data:
            log_threats = threat_detector.analyze_logs(data['log_data'])
            threats.extend(log_threats)
        
        # Analyze network data
        if 'network_data' in data:
            network_threats = threat_detector.analyze_network_traffic(data['network_data'])
            threats.extend(network_threats)
        
        # Remove duplicates and sort by severity
        unique_threats = _deduplicate_threats(threats)
        sorted_threats = sorted(unique_threats, key=lambda x: x['severity_score'], reverse=True)
        
        result = {
            'threats_detected': len(sorted_threats),
            'threats': sorted_threats[:50],  # Limit to top 50 threats
            'analysis_timestamp': datetime.utcnow().isoformat(),
            'confidence_threshold': 0.7
        }
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in threat detection: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/anomalies/detect', methods=['POST'])
def detect_anomalies():
    """Detect anomalies in system behavior"""
    try:
        data = request.get_json()
        
        if 'metrics' not in data:
            return jsonify({'error': 'Metrics data required'}), 400
        
        # Process metrics data
        metrics_df = pd.DataFrame(data['metrics'])
        
        # Detect anomalies
        anomalies = anomaly_detector.detect_anomalies(metrics_df)
        
        # Calculate anomaly scores
        anomaly_scores = anomaly_detector.calculate_anomaly_scores(metrics_df)
        
        result = {
            'anomalies_detected': len(anomalies),
            'anomalies': anomalies,
            'anomaly_scores': anomaly_scores.tolist(),
            'threshold': anomaly_detector.threshold,
            'analysis_timestamp': datetime.utcnow().isoformat()
        }
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in anomaly detection: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/intelligence/threats', methods=['GET'])
def get_threat_intelligence():
    """Get latest threat intelligence data"""
    try:
        # Check cache first
        cache_key = "threat_intelligence:latest"
        cached_data = redis_client.get(cache_key)
        
        if cached_data:
            return jsonify(json.loads(cached_data))
        
        # Fetch latest threat intelligence
        threat_data = threat_intelligence.get_latest_threats()
        iocs = threat_intelligence.get_indicators_of_compromise()
        cve_data = threat_intelligence.get_latest_cves()
        
        result = {
            'threat_campaigns': threat_data,
            'indicators_of_compromise': iocs,
            'latest_cves': cve_data,
            'last_updated': datetime.utcnow().isoformat()
        }
        
        # Cache for 30 minutes
        redis_client.setex(cache_key, 1800, json.dumps(result))
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error fetching threat intelligence: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/scan/vulnerabilities', methods=['POST'])
def scan_vulnerabilities():
    """Scan for vulnerabilities in the given targets"""
    try:
        data = request.get_json()
        
        if 'targets' not in data:
            return jsonify({'error': 'Target systems required'}), 400
        
        scan_results = []
        
        for target in data['targets']:
            result = vulnerability_scanner.scan_target(target)
            scan_results.append(result)
        
        # Aggregate results
        total_vulnerabilities = sum(len(result['vulnerabilities']) for result in scan_results)
        critical_count = sum(len([v for v in result['vulnerabilities'] if v['severity'] == 'Critical']) 
                           for result in scan_results)
        
        result = {
            'scan_id': f"scan_{int(datetime.utcnow().timestamp())}",
            'targets_scanned': len(data['targets']),
            'total_vulnerabilities': total_vulnerabilities,
            'critical_vulnerabilities': critical_count,
            'scan_results': scan_results,
            'scan_timestamp': datetime.utcnow().isoformat()
        }
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in vulnerability scanning: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/models/retrain', methods=['POST'])
def retrain_models():
    """Retrain AI models with new data"""
    try:
        data = request.get_json()
        model_type = data.get('model_type', 'all')
        
        results = {}
        
        if model_type in ['all', 'risk_predictor']:
            risk_predictor.retrain()
            results['risk_predictor'] = 'retrained'
        
        if model_type in ['all', 'threat_detector']:
            threat_detector.retrain()
            results['threat_detector'] = 'retrained'
        
        if model_type in ['all', 'anomaly_detector']:
            anomaly_detector.retrain()
            results['anomaly_detector'] = 'retrained'
        
        return jsonify({
            'status': 'success',
            'retrained_models': results,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error retraining models: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

def _check_redis_connection():
    """Check Redis connection health"""
    try:
        redis_client.ping()
        return True
    except:
        return False

def _check_database_connection():
    """Check database connection health"""
    try:
        conn = psycopg2.connect(app.config['DATABASE_URL'])
        conn.close()
        return True
    except:
        return False

def _check_models_status():
    """Check if AI models are loaded and ready"""
    return {
        'risk_predictor': risk_predictor.is_ready(),
        'threat_detector': threat_detector.is_ready(),
        'anomaly_detector': anomaly_detector.is_ready()
    }

def _categorize_risk_level(risk_score):
    """Categorize risk score into levels"""
    if risk_score >= 80:
        return 'Critical'
    elif risk_score >= 60:
        return 'High'
    elif risk_score >= 40:
        return 'Medium'
    elif risk_score >= 20:
        return 'Low'
    else:
        return 'Minimal'

def _generate_risk_recommendations(risk_score, risk_factors):
    """Generate risk mitigation recommendations"""
    recommendations = []
    
    if risk_score >= 70:
        recommendations.append("Immediate security review required")
        recommendations.append("Consider implementing additional access controls")
    
    if 'network_exposure' in risk_factors and risk_factors['network_exposure'] > 0.7:
        recommendations.append("Reduce network exposure through segmentation")
        recommendations.append("Implement network monitoring tools")
    
    if 'user_behavior' in risk_factors and risk_factors['user_behavior'] > 0.6:
        recommendations.append("Enhance user security training")
        recommendations.append("Implement user behavior analytics")
    
    return recommendations

def _deduplicate_threats(threats):
    """Remove duplicate threats based on similarity"""
    unique_threats = []
    seen_signatures = set()
    
    for threat in threats:
        signature = f"{threat['type']}_{threat['target']}_{threat['indicator']}"
        if signature not in seen_signatures:
            unique_threats.append(threat)
            seen_signatures.add(signature)
    
    return unique_threats

if __name__ == '__main__':
    port = int(os.getenv('AI_ENGINE_PORT', 5000))
    debug = os.getenv('DEBUG', 'False').lower() == 'true'
    
    logger.info(f"Starting AI Engine on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
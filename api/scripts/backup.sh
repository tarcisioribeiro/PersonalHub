#!/bin/bash

# ExpenseLit API Backup Script
# This script creates backups of the database and media files

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/app/backups}"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="${DB_NAME:-expenselit}"
DB_USER="${DB_USER:-postgres}"
CONTAINER_NAME="${CONTAINER_NAME:-expenselit-api-db-1}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" >&2
}

warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

log "Starting backup process..."

# Database backup
log "Creating database backup..."
if docker exec "$CONTAINER_NAME" pg_dump -U "$DB_USER" -d "$DB_NAME" > "$BACKUP_DIR/db_backup_$DATE.sql"; then
    log "Database backup created successfully: db_backup_$DATE.sql"
    
    # Compress the database backup
    gzip "$BACKUP_DIR/db_backup_$DATE.sql"
    log "Database backup compressed: db_backup_$DATE.sql.gz"
else
    error "Failed to create database backup"
    exit 1
fi

# Media files backup
log "Creating media files backup..."
if [ -d "/app/media" ] && [ "$(ls -A /app/media 2>/dev/null)" ]; then
    if tar -czf "$BACKUP_DIR/media_backup_$DATE.tar.gz" -C /app media/; then
        log "Media files backup created successfully: media_backup_$DATE.tar.gz"
    else
        warning "Failed to create media files backup"
    fi
else
    log "No media files found to backup"
fi

# Logs backup (optional)
if [ -d "/app/logs" ] && [ "$(ls -A /app/logs 2>/dev/null)" ]; then
    log "Creating logs backup..."
    if tar -czf "$BACKUP_DIR/logs_backup_$DATE.tar.gz" -C /app logs/; then
        log "Logs backup created successfully: logs_backup_$DATE.tar.gz"
    else
        warning "Failed to create logs backup"
    fi
fi

# Cleanup old backups
log "Cleaning up old backups (keeping last $RETENTION_DAYS days)..."
find "$BACKUP_DIR" -name "db_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
find "$BACKUP_DIR" -name "media_backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
find "$BACKUP_DIR" -name "logs_backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true

# Upload to cloud storage (if configured)
if [ -n "$AWS_S3_BUCKET" ] && command -v aws &> /dev/null; then
    log "Uploading backups to S3..."
    
    if aws s3 cp "$BACKUP_DIR/db_backup_$DATE.sql.gz" "s3://$AWS_S3_BUCKET/backups/" --storage-class STANDARD_IA; then
        log "Database backup uploaded to S3"
    else
        warning "Failed to upload database backup to S3"
    fi
    
    if [ -f "$BACKUP_DIR/media_backup_$DATE.tar.gz" ]; then
        if aws s3 cp "$BACKUP_DIR/media_backup_$DATE.tar.gz" "s3://$AWS_S3_BUCKET/backups/" --storage-class STANDARD_IA; then
            log "Media backup uploaded to S3"
        else
            warning "Failed to upload media backup to S3"
        fi
    fi
fi

# Generate backup report
BACKUP_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
log "Backup completed successfully!"
log "Total backup size: $BACKUP_SIZE"
log "Backup location: $BACKUP_DIR"

# List current backups
echo ""
log "Current backups:"
ls -lh "$BACKUP_DIR" | grep backup

echo ""
log "Backup process finished."
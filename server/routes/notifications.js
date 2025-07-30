const express = require('express');
const router = express.Router();
const { supabase } = require('../database/supabase');
const { authenticateToken, requireRole } = require('../middleware/auth');

/**
 * GET /notifications
 * Get all notifications for the authenticated user.
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { user } = req;

        const { data: notifications, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.user_id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching notifications:', error);
            return res.status(500).json({ message: 'Error al obtener notificaciones.' });
        }

        const unreadCount = notifications.filter(n => !n.read_at).length;

        res.status(200).json({
            success: true,
            notifications,
            unreadCount,
        });

    } catch (error) {
        console.error('Error in GET /notifications:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

/**
 * PATCH /notifications/:id/read
 * Mark a specific notification as read.
 */
router.patch('/:id/read', authenticateToken, async (req, res) => {
    try {
        const { user } = req;
        const { id } = req.params;

        const { data, error } = await supabase
            .from('notifications')
            .update({ read_at: new Date().toISOString() })
            .eq('id', id)
            .eq('user_id', user.user_id) // Ensure user can only mark their own notifications as read
            .select()
            .single();

        if (error) {
            console.error(`Error marking notification ${id} as read:`, error);
            return res.status(500).json({ message: 'Error al marcar notificación como leída.' });
        }

        if (!data) {
            return res.status(404).json({ message: 'Notificación no encontrada o no tienes permiso.' });
        }

        res.status(200).json({
            success: true,
            message: 'Notificación marcada como leída.',
            notification: data,
        });

    } catch (error) {
        console.error('Error in PATCH /notifications/:id/read:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

/**
 * PATCH /notifications/read-all
 * Mark all notifications for the authenticated user as read.
 */
router.patch('/read-all', authenticateToken, async (req, res) => {
    try {
        const { user } = req;

        const { error } = await supabase
            .from('notifications')
            .update({ read_at: new Date().toISOString() })
            .eq('user_id', user.user_id)
            .is('read_at', null); // Only mark unread notifications

        if (error) {
            console.error('Error marking all notifications as read:', error);
            return res.status(500).json({ message: 'Error al marcar todas las notificaciones como leídas.' });
        }

        res.status(200).json({
            success: true,
            message: 'Todas las notificaciones marcadas como leídas.',
        });

    } catch (error) {
        console.error('Error in PATCH /notifications/read-all:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
